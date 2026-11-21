# 🗺️ Sistema de Cálculo de Rotas entre Cidades

Trabalho prático da disciplina **INF104 – Estrutura de Dados** (Centro Universitário de Viçosa – UNIVIÇOSA).

Aplicação Full Stack que representa cidades como vértices de um grafo e estradas como arestas ponderadas (distância em km), e calcula a **menor rota** entre duas cidades usando o **algoritmo de Dijkstra**.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como executar](#como-executar)
- [API REST](#api-rest)
- [Algoritmo de Dijkstra](#algoritmo-de-dijkstra)
- [Visualização do grafo](#visualização-do-grafo)
- [Testes obrigatórios](#testes-obrigatórios)
- [Uso de Inteligência Artificial](#uso-de-inteligência-artificial)
- [Autores](#autores)

## Funcionalidades

- Cadastrar e remover **cidades** (identificador único e nome).
- Cadastrar e remover **estradas** entre duas cidades, com distância em km.
  - Valida se as cidades existem e se a distância é válida (não negativa).
  - Impede estradas duplicadas, considerando que podem ser percorridas nos dois sentidos.
- Listar cidades e estradas com suas distâncias.
- **Calcular a menor rota** (Dijkstra): cidade de origem, destino, sequência de cidades percorridas e distância total.
- Informar quando **não existe rota** entre origem e destino.
- Remover uma cidade elimina todas as estradas ligadas a ela.
- Representação visual do grafo, com o caminho calculado destacado.

## Tecnologias

**Backend**

- Java
- Spring Boot (API REST)

**Frontend**

- React + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

## Arquitetura

```text
sistema-rotas/
│
├── backend/
│   └── src/main/java/.../
│       ├── model/         # Cidade, Estrada
│       ├── repository/    # CidadeRepository, EstradaRepository
│       ├── service/       # CidadeService, EstradaService, DijkstraService
│       ├── controller/    # CidadeController, EstradaController, RotaController
│       ├── dto/
│       └── config/
│
└── frontend/
    └── src/
        ├── components/    # Layout, Navbar, Loading, ErrorMessage, GrafoView
        ├── hooks/         # useCidades, useEstradas
        ├── pages/         # CidadesPage, EstradasPage, RotaPage
        ├── services/      # api.ts (Axios + funções por recurso)
        ├── types/         # Interfaces do contrato da API
        ├── App.tsx        # Rotas
        └── main.tsx
```

O backend segue a separação em camadas (controller → service → repository). O frontend consome a API por meio de uma camada de serviço (`services/api.ts`), com hooks para carregamento e estado de erro e páginas que compõem os componentes reutilizáveis.

## Como executar

### Pré-requisitos

- JDK instalado (versão usada no projeto: _preencher_)
- Node.js 18+ e npm

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080/api`.

> Para que o frontend exiba as mensagens de erro do backend, o Spring precisa expor a mensagem da exceção (`server.error.include-message=always` no `application.properties`) e liberar CORS para `http://localhost:5173`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## API REST

URL base: `http://localhost:8080/api`

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/cidades` | Lista as cidades |
| POST | `/cidades` | Cadastra uma cidade (`{ "name": string }`) |
| DELETE | `/cidades/{id}` | Remove a cidade e suas estradas |
| GET | `/estradas` | Lista as estradas |
| POST | `/estradas` | Cadastra uma estrada (`{ "cidadeA": { "id" }, "cidadeB": { "id" }, "distanciaKm" }`) |
| DELETE | `/estradas/{id}` | Remove a estrada |
| GET | `/rotas?origem={id}&destino={id}` | Calcula a menor rota |

Resposta de `/rotas`:

```json
{
  "caminho": [
    { "id": 1, "name": "Viçosa" },
    { "id": 2, "name": "Coimbra" },
    { "id": 3, "name": "Araponga" }
  ],
  "distanciaTotal": 40
}
```

Quando não há rota ou a validação falha, a API responde com HTTP 500 e uma mensagem (ex.: `Não existe rota entre as cidades informadas`), exibida na interface em um alerta vermelho.

## Algoritmo de Dijkstra

O Dijkstra encontra o caminho de menor custo entre um vértice de origem e todos os outros em um grafo com pesos **não negativos**, que é o caso das distâncias das estradas.

### Ideia

Mantém-se, para cada cidade, a **melhor distância conhecida até agora** a partir da origem. A cada passo, escolhe-se a cidade ainda não processada com a menor distância, e verifica-se se passar por ela encurta o caminho até suas vizinhas. Como os pesos não são negativos, quando uma cidade é escolhida sua distância já é definitiva.

### Passo a passo

1. Defina `dist[origem] = 0` e `dist[outras] = ∞`. Todas as cidades começam como não visitadas, sem predecessor.
2. Insira a origem em uma **fila de prioridade** (ordenada pela distância).
3. Enquanto a fila não estiver vazia:
   1. Remova a cidade `u` com a menor distância.
   2. Se `u` já foi visitada, ignore. Senão, marque-a como visitada.
   3. Para cada estrada `(u, v, peso)`: se `dist[u] + peso < dist[v]`, atualize `dist[v]`, registre `anterior[v] = u` e insira `v` na fila.
4. Ao terminar:
   - Se `dist[destino] = ∞`, **não existe rota**.
   - Caso contrário, reconstrua o caminho seguindo `anterior[]` do destino até a origem e inverta a sequência.

### Exemplo

```text
        120               Origem: A   Destino: D
   A ---------- B
   |            |         A → B = 120, B → D = 100  →  220 km
  180          100        A → C = 180, C → D = 90   →  270 km
   |            |
   C ---------- D         Menor rota: A → B → D (220 km)
         90
```

### Complexidade

Com fila de prioridade (`PriorityQueue`), **O((V + E) log V)**, onde V é o número de cidades e E o de estradas.

### Observações do projeto

- As estradas são **não direcionadas**: cada estrada é tratada nos dois sentidos.
- Origem igual ao destino retorna distância 0.
- Se existirem duas rotas com a mesma distância mínima, é apresentada uma delas.

## Visualização do grafo

O componente `GrafoView` desenha o grafo em SVG puro, sem bibliotecas de gráficos:

- Cidades são círculos e estradas são linhas com a distância (km) no meio.
- O **layout é proporcional às distâncias**: calcula-se a menor distância entre todos os pares de cidades (Floyd-Warshall) e aplica-se _stress majorization_ para posicionar os vértices de forma que a distância visual aproxime a distância real em km. É uma aproximação, pois nem todo conjunto de distâncias cabe exatamente em um plano.
- Ao calcular uma rota, o caminho é destacado: origem em verde, destino em vermelho, cidades intermediárias em índigo e estradas do trajeto mais grossas.
- Como o Floyd-Warshall é usado apenas para posicionar os vértices, o cálculo da rota em si é feito exclusivamente pelo Dijkstra no backend.

## Testes obrigatórios

| # | Situação | Resultado esperado |
| - | -------- | ------------------ |
| 1 | Origem e destino iguais | Distância zero |
| 2 | Existe estrada direta | Distância direta ou alternativa menor, se houver |
| 3 | Rota com cidades intermediárias | Sequência correta e distância mínima |
| 4 | Duas rotas com a mesma distância | Apresenta uma das rotas mínimas |
| 5 | Sem conexão entre origem e destino | Informa que não existe rota |
| 6 | Estrada removida | Recalcula com o grafo atualizado |
| 7 | Cidade removida | Elimina suas conexões e atualiza consultas |
| 8 | Cidade inexistente | Mensagem de erro adequada |
| 9 | Distância negativa | Cadastro rejeitado |
| 10 | Estrada cadastrada novamente | Duplicação impedida |

## Uso de Inteligência Artificial

**Ferramenta utilizada:** Claude (Anthropic).

**Em quais etapas foi utilizada:** a IA foi usada para **compreender a arquitetura** do projeto, tanto do backend (camadas de controller, service e repository, e o contrato da API) quanto do frontend (organização em components, hooks, pages, services e types). Também auxiliou no desenvolvimento do **componente de grafo** (`GrafoView`), que faz a representação visual das cidades e estradas.

**O que foi aproveitado e o que foi alterado pelo grupo:** _preencher: por exemplo, quais trechos do `GrafoView` e da estrutura do frontend foram mantidos e quais ajustes o grupo fez (estilos, textos, layout, tratamento de erros etc.)._

**Como o grupo verificou e compreendeu o código:** _preencher: por exemplo, testes manuais dos 10 casos obrigatórios com a API rodando, leitura e explicação do código gerado, comparação do resultado do grafo visual com as distâncias cadastradas._

O algoritmo de Dijkstra e as regras de negócio do backend foram implementados e são explicados pelo grupo na apresentação.

## Autores

- _Nathan Ramos Rezende_

Disciplina: INF104 – Estrutura de Dados · Professor: Anderson Resende Lamas · UNIVIÇOSA