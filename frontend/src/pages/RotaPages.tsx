import { Fragment, useState, type FormEvent } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import GrafoView from '../components/GrafoView';
import Loading from '../components/Loading';
import { useCidades } from '../hooks/useCidades';
import { useEstradas } from '../hooks/useEstradas';
import { getErrorMessage, rotaService } from '../services/api';
import type { RotaResultado } from '../types';

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export default function RotaPage() {
  const { cidades, loading, erro: erroCidades, setErro: setErroCidades } = useCidades();
  const {
    estradas,
    loading: loadingEstradas,
    erro: erroEstradas,
    setErro: setErroEstradas,
  } = useEstradas();

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [resultado, setResultado] = useState<RotaResultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [calculando, setCalculando] = useState(false);

  async function handleCalcular(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    if (!origem || !destino) {
      setErro('Selecione a cidade de origem e a de destino.');
      return;
    }

    setCalculando(true);
    try {
      setResultado(await rotaService.calcular(Number(origem), Number(destino)));
    } catch (e) {
      // Inclui "Não existe rota entre as cidades informadas" (HTTP 500 do backend)
      setErro(getErrorMessage(e));
    } finally {
      setCalculando(false);
    }
  }

  const formatarKm = (n: number) =>
    n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Calcular Menor Rota</h2>

      {loading ? (
        <Loading texto="Carregando cidades..." />
      ) : cidades.length === 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre cidades e estradas antes de calcular uma rota.
        </p>
      ) : (
        <form
          onSubmit={handleCalcular}
          className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
        >
          <select
            value={origem}
            onChange={(e) => setOrigem(e.target.value)}
            className={selectClass}
            aria-label="Origem"
          >
            <option value="">Origem</option>
            {cidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className={selectClass}
            aria-label="Destino"
          >
            <option value="">Destino</option>
            {cidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={calculando}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1"
          >
            {calculando ? 'Calculando...' : 'Calcular Menor Rota'}
          </button>
        </form>
      )}

      <ErrorMessage mensagem={erro} onFechar={() => setErro(null)} />
      <ErrorMessage mensagem={erroCidades} onFechar={() => setErroCidades(null)} />
      <ErrorMessage mensagem={erroEstradas} onFechar={() => setErroEstradas(null)} />

      {calculando && <Loading texto="Executando Dijkstra..." />}

      {resultado && (
        <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-wide text-indigo-100">
              Distância total
            </p>
            <p className="text-3xl font-bold">
              {formatarKm(resultado.distanciaTotal)} km
            </p>
          </div>

          <div className="space-y-3 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Caminho percorrido ({resultado.caminho.length}{' '}
              {resultado.caminho.length === 1 ? 'cidade' : 'cidades'})
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {resultado.caminho.map((cidade, i) => {
                const primeira = i === 0;
                const ultima = i === resultado.caminho.length - 1;
                return (
                  <Fragment key={`${cidade.id}-${i}`}>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        primeira
                          ? 'bg-emerald-100 text-emerald-800'
                          : ultima
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cidade.name}
                    </span>
                    {!ultima && <span className="text-slate-400">→</span>}
                  </Fragment>
                );
              })}
            </div>

            <p className="text-sm text-slate-500">
              {resultado.caminho.map((c) => c.name).join(' → ')} | Distância total:{' '}
              {formatarKm(resultado.distanciaTotal)} km
            </p>
          </div>
        </div>
      )}

      {cidades.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Grafo da rede
          </h3>
          {loadingEstradas ? (
            <Loading texto="Carregando grafo..." />
          ) : (
            <GrafoView
              cidades={cidades}
              estradas={estradas}
              caminho={resultado?.caminho}
            />
          )}
        </div>
      )}
    </section>
  );
}   