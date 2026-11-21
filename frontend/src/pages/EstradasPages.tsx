import { useState, type FormEvent } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { useCidades } from '../hooks/useCidades';
import { useEstradas } from '../hooks/useEstradas';
import { estradaService, getErrorMessage } from '../services/api';

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export default function EstradasPage() {
  const {
    cidades,
    loading: loadingCidades,
    erro: erroCidades,
    setErro: setErroCidades,
  } = useCidades();
  const {
    estradas,
    loading: loadingEstradas,
    erro: erroEstradas,
    setErro: setErroEstradas,
    recarregar,
  } = useEstradas();

  const [cidadeA, setCidadeA] = useState('');
  const [cidadeB, setCidadeB] = useState('');
  const [distancia, setDistancia] = useState('');
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  function limparErros() {
    setErroForm(null);
    setErroCidades(null);
    setErroEstradas(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    limparErros();

    if (!cidadeA || !cidadeB) {
      setErroForm('Selecione as duas cidades.');
      return;
    }
    if (distancia.trim() === '' || Number.isNaN(Number(distancia))) {
      setErroForm('Informe uma distância válida.');
      return;
    }

    setSalvando(true);
    try {
      await estradaService.criar({
        cidadeA: { id: Number(cidadeA) },
        cidadeB: { id: Number(cidadeB) },
        distanciaKm: Number(distancia),
      });
      setDistancia('');
      await recarregar();
    } catch (e) {
      setErroForm(getErrorMessage(e));
    } finally {
      setSalvando(false);
    }
  }

  async function handleRemover(id: number) {
    if (!window.confirm('Remover esta estrada?')) return;

    limparErros();
    setRemovendoId(id);
    try {
      await estradaService.remover(id);
      await recarregar();
    } catch (e) {
      setErroForm(getErrorMessage(e));
    } finally {
      setRemovendoId(null);
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Gerenciar Estradas</h2>

      {loadingCidades ? (
        <Loading texto="Carregando cidades..." />
      ) : cidades.length < 2 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre pelo menos duas cidades na aba "Cidades" para criar estradas.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <select
            value={cidadeA}
            onChange={(e) => setCidadeA(e.target.value)}
            className={selectClass}
            aria-label="Cidade A"
          >
            <option value="">Cidade A</option>
            {cidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={cidadeB}
            onChange={(e) => setCidadeB(e.target.value)}
            className={selectClass}
            aria-label="Cidade B"
          >
            <option value="">Cidade B</option>
            {cidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="any"
            value={distancia}
            onChange={(e) => setDistancia(e.target.value)}
            placeholder="Distância (km)"
            aria-label="Distância em km"
            className={selectClass}
          />

          <button
            type="submit"
            disabled={salvando}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Cadastrar estrada'}
          </button>
        </form>
      )}

      <ErrorMessage mensagem={erroForm} onFechar={() => setErroForm(null)} />
      <ErrorMessage mensagem={erroCidades} onFechar={() => setErroCidades(null)} />
      <ErrorMessage mensagem={erroEstradas} onFechar={() => setErroEstradas(null)} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loadingEstradas ? (
          <Loading texto="Carregando estradas..." />
        ) : estradas.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhuma estrada cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Cidade A</th>
                  <th className="px-4 py-3">Cidade B</th>
                  <th className="px-4 py-3">Distância</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {estradas.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{e.cidadeA.name}</td>
                    <td className="px-4 py-3 font-medium">{e.cidadeB.name}</td>
                    <td className="px-4 py-3">{e.distanciaKm} km</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemover(e.id)}
                        disabled={removendoId === e.id}
                        className="rounded-md px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {removendoId === e.id ? 'Removendo...' : 'Deletar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}