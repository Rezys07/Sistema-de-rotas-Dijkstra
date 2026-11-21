import { useState, type FormEvent } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { useCidades } from '../hooks/useCidades';
import { cidadeService, getErrorMessage } from '../services/api';

export default function CidadesPage() {
  const { cidades, loading, erro, setErro, recarregar } = useCidades();
  const [nome, setNome] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = nome.trim();
    if (!name) {
      setErro('Informe o nome da cidade.');
      return;
    }

    setSalvando(true);
    setErro(null);
    try {
      await cidadeService.criar({ name });
      setNome('');
      await recarregar();
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setSalvando(false);
    }
  }

  async function handleRemover(id: number, name: string) {
    const ok = window.confirm(
      `Remover "${name}"? Todas as estradas ligadas a ela também serão removidas.`,
    );
    if (!ok) return;

    setRemovendoId(id);
    setErro(null);
    try {
      await cidadeService.remover(id);
      await recarregar();
    } catch (e) {
      setErro(getErrorMessage(e));
    } finally {
      setRemovendoId(null);
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Gerenciar Cidades</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da cidade (ex: Viçosa)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          disabled={salvando}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {salvando ? 'Salvando...' : 'Cadastrar'}
        </button>
      </form>

      <ErrorMessage mensagem={erro} onFechar={() => setErro(null)} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Loading texto="Carregando cidades..." />
        ) : cidades.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhuma cidade cadastrada.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cidades.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">{c.id}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemover(c.id, c.name)}
                      disabled={removendoId === c.id}
                      className="rounded-md px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {removendoId === c.id ? 'Removendo...' : 'Deletar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}