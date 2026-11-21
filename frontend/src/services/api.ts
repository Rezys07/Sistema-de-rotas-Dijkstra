import axios, { AxiosError } from 'axios';
import type {
  Cidade,
  CidadeRequest,
  Estrada,
  EstradaRequest,
  RotaResultado,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ---------- Tratamento de erros ----------

/**
 * Extrai a mensagem de erro enviada pelo backend.
 * Funciona com corpo em texto puro ou JSON ({ message } / { error }).
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<unknown>;

    // Backend fora do ar / CORS / rede
    if (!err.response) {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080.';
    }

    const data = err.response.data;

    if (typeof data === 'string' && data.trim()) return data;

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      if (typeof obj.message === 'string' && obj.message) return obj.message;
      if (typeof obj.error === 'string' && obj.error) return obj.error;
    }

    return `Erro ${err.response.status}: não foi possível concluir a operação.`;
  }

  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado.';
}

// ---------- Cidades ----------

export const cidadeService = {
  listar: async (): Promise<Cidade[]> => {
    const { data } = await api.get<Cidade[]>('/cidades');
    return data;
  },

  criar: async (payload: CidadeRequest): Promise<void> => {
    await api.post('/cidades', payload);
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/cidades/${id}`);
  },
};

// ---------- Estradas ----------

export const estradaService = {
  listar: async (): Promise<Estrada[]> => {
    const { data } = await api.get<Estrada[]>('/estradas');
    return data;
  },

  criar: async (payload: EstradaRequest): Promise<void> => {
    await api.post('/estradas', payload);
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/estradas/${id}`);
  },
};

// ---------- Rotas (Dijkstra) ----------

export const rotaService = {
  calcular: async (origem: number, destino: number): Promise<RotaResultado> => {
    const { data } = await api.get<RotaResultado>('/rotas', {
      params: { origem, destino },
    });
    return data;
  },
};

export default api;