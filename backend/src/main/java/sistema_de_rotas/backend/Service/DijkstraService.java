package sistema_de_rotas.backend.Service;

import org.springframework.stereotype.Service;
import sistema_de_rotas.backend.Dto.Rotas.RotaResponseDTO;
import sistema_de_rotas.backend.Model.Cidade;
import sistema_de_rotas.backend.Model.Estrada;
import sistema_de_rotas.backend.Repository.CidadeRepository;
import sistema_de_rotas.backend.Repository.EstradaRepository;

import java.util.*;

@Service
public class DijkstraService {

    private final CidadeRepository cidadeRepository;
    private final EstradaRepository estradaRepository;

    public DijkstraService(CidadeRepository cidadeRepository, EstradaRepository estradaRepository) {
        this.cidadeRepository = cidadeRepository;
        this.estradaRepository = estradaRepository;
    }

    // Classe auxiliar para a PriorityQueue.
    // O Java não sabe ordenar Cidade e Distância juntas, então criamos esse record.
    // O "implements Comparable" diz ao Java para ordenar SEMPRE pela menor distância.
    public record CidadeDistancia(Cidade cidade, double distancia) implements Comparable<CidadeDistancia> {
        @Override
        public int compareTo(CidadeDistancia outra) {
            return Double.compare(this.distancia, outra.distancia);
        }
    }

    public RotaResponseDTO calcularRota(Long origemId, Long destinoId) {

        // 1. Busca as cidades no banco de dados. Se não existirem, lança um erro.
        Cidade origem = cidadeRepository.findById(origemId)
                .orElseThrow(() -> new RuntimeException("Cidade de origem não encontrada"));
        Cidade destino = cidadeRepository.findById(destinoId)
                .orElseThrow(() -> new RuntimeException("Cidade de destino não encontrada"));

        // Se a origem for igual ao destino, a distância é 0 e o caminho só tem a própria cidade.
        if (origem.getId().equals(destino.getId())) {
            return new RotaResponseDTO(List.of(origem), 0.0);
        }

        // 2. Criação das estruturas de dados do Dijkstra
        // Map que guarda a MENOR distância conhecida da origem até cada cidade
        Map<Long, Double> distancias = new HashMap<>();

        // Map que guarda "quem veio antes" de cada cidade, para reconstruir o caminho no final
        Map<Long, Cidade> anteriores = new HashMap<>();

        // Fila de prioridade que sempre nos dará a cidade com a MENOR distância atual
        PriorityQueue<CidadeDistancia> filaPrioridade = new PriorityQueue<>();

        // Set que guarda as cidades que já foram totalmente processadas (visitadas)
        Set<Long> visitados = new HashSet<>();

        // 3. Inicialização
        // A distância da origem até ela mesma é 0
        distancias.put(origem.getId(), 0.0);
        // Coloca a origem na fila para começar o algoritmo
        filaPrioridade.add(new CidadeDistancia(origem, 0.0));

        // 4. O Loop Principal do Dijkstra
        while (!filaPrioridade.isEmpty()) {
            // a) Tira a cidade mais perto da fila (o menor caminho conhecido até agora)
            CidadeDistancia atualObj = filaPrioridade.poll();
            Cidade cidadeAtual = atualObj.cidade();
            double distanciaAtual = atualObj.distancia();

            // b) Se a cidade já foi visitada, a gente ignora e pula para a próxima
            if (visitados.contains(cidadeAtual.getId())) {
                continue;
            }

            // c) Marca a cidade como visitada
            visitados.add(cidadeAtual.getId());

            // d) Otimização: Se chegamos no destino, não precisamos calcular o resto do mapa
            if (cidadeAtual.getId().equals(destinoId)) {
                break;
            }

            // e) Busca todas as estradas conectadas a essa cidade
            List<Estrada> estradasDaCidade = estradaRepository.findByCidadeAOrCidadeB(cidadeAtual, cidadeAtual);

            // f) Analisa cada estrada (vizinho) para tentar achar um caminho mais curto
            for (Estrada estrada : estradasDaCidade) {
                // Descobre quem é o vizinho (se a cidade atual é a ponta A, o vizinho é a B, e vice-versa)
                Cidade vizinho;
                if (estrada.getCidadeA().getId().equals(cidadeAtual.getId())) {
                    vizinho = estrada.getCidadeB();
                } else {
                    vizinho = estrada.getCidadeA();
                }

                // Se o vizinho já foi visitado, não perdemos tempo com ele
                if (visitados.contains(vizinho.getId())) {
                    continue;
                }

                // Calcula a distância para chegar no vizinho passando pela cidadeAtual
                double novaDistancia = distanciaAtual + estrada.getDistanciaKm();

                // Pega a distância atual registrada para o vizinho (se não existir, é infinito)
                double distanciaConhecidaVizinho = distancias.getOrDefault(vizinho.getId(), Double.MAX_VALUE);

                // SE a nova distância for MENOR que a distância que já conhecíamos para o vizinho:
                if (novaDistancia < distanciaConhecidaVizinho) {
                    // Atualiza a menor distância no Map
                    distancias.put(vizinho.getId(), novaDistancia);

                    // Registra que para chegar no vizinho, o melhor caminho passa pela cidadeAtual
                    anteriores.put(vizinho.getId(), cidadeAtual);

                    // Coloca o vizinho na fila de prioridade para ser processado
                    filaPrioridade.add(new CidadeDistancia(vizinho, novaDistancia));
                }
            }
        }

        // 5. Verifica se o destino foi alcançado.
        // Se a distância do destino continuar "Infinito" (MAX_VALUE), significa que o grafo é desconexo.
        if (!distancias.containsKey(destinoId) || distancias.get(destinoId) == Double.MAX_VALUE) {
            throw new RuntimeException("Não existe rota entre as cidades informadas");
        }

        // 6. Reconstruir o caminho percorrido
        List<Cidade> caminho = new ArrayList<>();
        Cidade passoAtual = destino;

        // Enquanto houver um passo atual, adiciona ele na lista
        while (passoAtual != null) {
            caminho.add(passoAtual);
            // Pega o "pai" do passo atual (quem veio antes dele no caminho mínimo)
            // Se for a origem, o map vai retornar null, e o loop encerra
            passoAtual = anteriores.get(passoAtual.getId());
        }

        // Como nós voltamos do destino para a origem, a lista está invertida.
        // O Collections.reverse() inverte a lista para ficar Origem -> Destino.
        Collections.reverse(caminho);

        // 7. Retorna o DTO com a lista de cidades e a distância total
        return new RotaResponseDTO(caminho, distancias.get(destinoId));
    }
}