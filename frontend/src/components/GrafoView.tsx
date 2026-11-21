import { useMemo } from 'react';
import type { Cidade, Estrada } from '../types';

interface GrafoViewProps {
  cidades: Cidade[];
  estradas: Estrada[];
  /** Caminho calculado pelo Dijkstra (opcional). Quando presente, é destacado. */
  caminho?: Cidade[];
}

const WIDTH = 760;
const HEIGHT = 620;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RAIO_CIRCULO = 215;
const RAIO_NO = 14;

// Chave não-direcional: a estrada A-B é a mesma que B-A
const chaveAresta = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);

const formatarKm = (n: number) =>
  n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export default function GrafoView({ cidades, estradas, caminho = [] }: GrafoViewProps) {
  // Posição de cada cidade, distribuídas uniformemente em círculo (começando no topo)
  const posicoes = useMemo(() => {
    const mapa = new Map<number, { x: number; y: number; cos: number; sin: number }>();
    cidades.forEach((c, i) => {
      const angulo = -Math.PI / 2 + (2 * Math.PI * i) / cidades.length;
      const cos = Math.cos(angulo);
      const sin = Math.sin(angulo);
      mapa.set(c.id, {
        x: CX + RAIO_CIRCULO * cos,
        y: CY + RAIO_CIRCULO * sin,
        cos,
        sin,
      });
    });
    return mapa;
  }, [cidades]);

  // Estradas e cidades que fazem parte do caminho
  const arestasDoCaminho = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < caminho.length - 1; i++) {
      set.add(chaveAresta(caminho[i].id, caminho[i + 1].id));
    }
    return set;
  }, [caminho]);

  const idsDoCaminho = useMemo(() => new Set(caminho.map((c) => c.id)), [caminho]);

  const temCaminho = caminho.length > 0;
  const origemId = temCaminho ? caminho[0].id : null;
  const destinoId = temCaminho ? caminho[caminho.length - 1].id : null;

  if (cidades.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-500">
        Nenhuma cidade para exibir no grafo.
      </p>
    );
  }

  // Desenha as estradas fora do caminho primeiro, e as do caminho por cima
  const estradasValidas = estradas.filter(
    (e) => posicoes.has(e.cidadeA.id) && posicoes.has(e.cidadeB.id),
  );
  const normais = estradasValidas.filter(
    (e) => !arestasDoCaminho.has(chaveAresta(e.cidadeA.id, e.cidadeB.id)),
  );
  const destacadas = estradasValidas.filter((e) =>
    arestasDoCaminho.has(chaveAresta(e.cidadeA.id, e.cidadeB.id)),
  );

  function corDoNo(id: number) {
    if (id === origemId) return '#10b981'; // verde
    if (id === destinoId) return '#f43f5e'; // vermelho
    if (idsDoCaminho.has(id)) return '#6366f1'; // índigo
    return temCaminho ? '#cbd5e1' : '#94a3b8'; // cinza
  }

  function renderLinha(e: Estrada, destacada: boolean) {
    const a = posicoes.get(e.cidadeA.id)!;
    const b = posicoes.get(e.cidadeB.id)!;
    return (
      <line
        key={`linha-${e.id}`}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={destacada ? '#6366f1' : '#cbd5e1'}
        strokeWidth={destacada ? 4 : 1.5}
        strokeLinecap="round"
        opacity={!destacada && temCaminho ? 0.6 : 1}
      />
    );
  }

  function renderRotulo(e: Estrada, destacada: boolean) {
    const a = posicoes.get(e.cidadeA.id)!;
    const b = posicoes.get(e.cidadeB.id)!;
    return (
      <text
        key={`dist-${e.id}`}
        x={(a.x + b.x) / 2}
        y={(a.y + b.y) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={destacada ? 13 : 11}
        fontWeight={destacada ? 700 : 500}
        fill={destacada ? '#4338ca' : '#64748b'}
        stroke="white"
        strokeWidth={4}
        paintOrder="stroke"
      >
        {formatarKm(e.distanciaKm)}
      </text>
    );
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Representação visual do grafo de cidades e estradas"
      >
        {/* 1. Estradas normais */}
        <g>{normais.map((e) => renderLinha(e, false))}</g>

        {/* 2. Estradas do caminho (por cima) */}
        <g>{destacadas.map((e) => renderLinha(e, true))}</g>

        {/* 3. Distâncias */}
        <g>
          {normais.map((e) => renderRotulo(e, false))}
          {destacadas.map((e) => renderRotulo(e, true))}
        </g>

        {/* 4. Cidades */}
        <g>
          {cidades.map((c) => {
            const p = posicoes.get(c.id)!;
            const lx = CX + (RAIO_CIRCULO + RAIO_NO + 12) * p.cos;
            const ly = CY + (RAIO_CIRCULO + RAIO_NO + 12) * p.sin + 4;
            const anchor = p.cos > 0.2 ? 'start' : p.cos < -0.2 ? 'end' : 'middle';
            const noDoCaminho = idsDoCaminho.has(c.id);

            return (
              <g key={c.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={RAIO_NO}
                  fill={corDoNo(c.id)}
                  stroke="white"
                  strokeWidth={3}
                >
                  <title>{c.name}</title>
                </circle>
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  fontSize={13}
                  fontWeight={noDoCaminho ? 700 : 500}
                  fill={temCaminho && !noDoCaminho ? '#94a3b8' : '#1e293b'}
                >
                  {c.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legenda */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-slate-400" /> Cidade
        </span>
        {temCaminho && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> Origem
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-indigo-500" /> Intermediária
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500" /> Destino
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-5 rounded bg-indigo-500" /> Rota mínima
            </span>
          </>
        )}
        <span>Números nas linhas = distância (km)</span>
      </div>
    </div>
  );
}