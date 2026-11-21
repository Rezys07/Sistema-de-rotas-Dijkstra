export interface Cidade {
    id: Number;
    name: string
}

export interface Estrada {
    id: number;
    cidadeA: Cidade;
    cidadeB: Cidade;
    distanciaKm: number;
}

export interface RotaResultado {
  caminho: Cidade[];
  distanciaTotal: number;
}

// ---------- Payloads enviados para a API ----------

export interface CidadeRequest {
  name: string;
}

export interface EstradaRequest {
  cidadeA: { id: number };
  cidadeB: { id: number };
  distanciaKm: number;
}