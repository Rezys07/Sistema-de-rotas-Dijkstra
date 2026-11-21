package sistema_de_rotas.backend.Service;

import org.springframework.stereotype.Service;
import sistema_de_rotas.backend.Dto.Estrada.EstradaRequestDTO;
import sistema_de_rotas.backend.Dto.Estrada.EstradaResponseDTO;
import sistema_de_rotas.backend.Model.Cidade;
import sistema_de_rotas.backend.Model.Estrada;
import sistema_de_rotas.backend.Repository.CidadeRepository;
import sistema_de_rotas.backend.Repository.EstradaRepository;

import java.util.List;

@Service
public class EstradaService {
    private final EstradaRepository estradaRepository;
    private final CidadeRepository cidadeRepository;

    public EstradaService(EstradaRepository estradaRepository, CidadeRepository cidadeRepository) {
        this.estradaRepository = estradaRepository;
        this.cidadeRepository = cidadeRepository;
    }

    public EstradaResponseDTO cadastrarEstrada(EstradaRequestDTO dto) {

        //Validações para usar antes de salvar
        if(dto.distanciaKm() < 0) {
            throw new RuntimeException("A distancia não pode ser negativa");
            //quebra a sequencia e joga o erro;
        }

        Cidade cidadeA = cidadeRepository.findById(dto.cidadeA().getId())
                .orElseThrow(() -> new RuntimeException("Cidade de origem não encontrada"));

        Cidade cidadeB = cidadeRepository.findById(dto.cidadeB().getId())
                .orElseThrow(() -> new RuntimeException("Cidade de destino não encontrada"));

        if (cidadeA.getId().equals(cidadeB.getId())) {
            throw new RuntimeException("Uma cidade não pode conectar com ela mesma");
        }



        boolean estradaExiste = estradaRepository.existsByCidadeAAndCidadeB(cidadeA, cidadeB) ||
                estradaRepository.existsByCidadeAAndCidadeB(cidadeB, cidadeA);
        if(estradaExiste) throw new RuntimeException("Essa estrada já está cadastrada");


        //salvar a estrada
        Estrada estrada = new Estrada();

        estrada.setCidadeA(cidadeA);
        estrada.setCidadeB(cidadeB);
        estrada.setDistanciaKm(dto.distanciaKm());

        Estrada estradaSalva = estradaRepository.save(estrada);

        return new EstradaResponseDTO(
                estradaSalva.getId(),
                estradaSalva.getCidadeA(),
                estradaSalva.getCidadeB(),
                estradaSalva.getDistanciaKm()
        );
    }

    public List<EstradaResponseDTO> listarTodasAsEstradas() {
        return estradaRepository.findAll()
                .stream()
                .map(estrada -> new EstradaResponseDTO(
                        estrada.getId(),
                        estrada.getCidadeA(),
                        estrada.getCidadeB(),
                        estrada.getDistanciaKm()
                )).toList();

    }


    public EstradaResponseDTO listarEstrada(Long id) {
        Estrada estrada = estradaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estrada não encontrada"));

        return new EstradaResponseDTO(
                estrada.getId(),
                estrada.getCidadeA(),
                estrada.getCidadeB(),
                estrada.getDistanciaKm()
        );
    }

    public boolean verificarExistenciaDasEstradas(Long id) {
        return estradaRepository.existsById(id);
    }

    public String removerEstrada(Long id) {
        if (!estradaRepository.existsById(id)) {
            throw new RuntimeException("Estrada não encontrada");
        }
        estradaRepository.deleteById(id);
        return "Estrada removida com sucesso!";
    }
}
