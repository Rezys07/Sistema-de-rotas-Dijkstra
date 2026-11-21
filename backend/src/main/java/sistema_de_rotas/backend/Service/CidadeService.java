package sistema_de_rotas.backend.Service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import sistema_de_rotas.backend.Dto.Cidade.CidadeRequestDTO;
import sistema_de_rotas.backend.Dto.Cidade.CidadeResponseDTO;
import sistema_de_rotas.backend.Model.Cidade;
import sistema_de_rotas.backend.Repository.CidadeRepository;
import sistema_de_rotas.backend.Repository.EstradaRepository;

import java.util.List;

@Service
public class CidadeService {

    private final CidadeRepository cidadeRepository;
    private final EstradaRepository estradaRepository;

    public CidadeService(CidadeRepository cidadeRepository, EstradaRepository estradaRepository) {
        this.cidadeRepository = cidadeRepository;
        this.estradaRepository = estradaRepository;
    }

    public CidadeResponseDTO cadastrar(CidadeRequestDTO dto) {
        if(dto.name() == null || dto.name().isBlank()) {
            throw new RuntimeException("O nome da cidade é obrigatorio");
        }
        if(cidadeRepository.existsByNameIgnoreCase(dto.name())){
            throw new RuntimeException("A cidade já existe");
        }

        Cidade cidade = new Cidade(); // nova instancia de cidade
        cidade.setName(dto.name()); //setar o nome dessa entidade com oq foi escrito

        Cidade cidadeSalva = cidadeRepository.save(cidade); //salvar no banco

        return new CidadeResponseDTO(
                cidadeSalva.getId(),
                cidadeSalva.getName()
        ); //return com os dados do banco
    }

    public List<CidadeResponseDTO> listarTodasAsCidades() {
        return cidadeRepository.findAll()
                .stream()
                .map(cidade -> new CidadeResponseDTO(
                        cidade.getId(),
                        cidade.getName()
                )).toList();
    }

    public CidadeResponseDTO listarCidade(Long id) {
        Cidade cidade = cidadeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cidade não encontrada"));

        return new CidadeResponseDTO(
                cidade.getId(),
                cidade.getName()
        );

    }

    public boolean verificarExistenciaDaCidade(Long id) {
        return cidadeRepository.existsById(id) ;
    }
    @Transactional
    public String removerCidade(Long id) {
        Cidade cidade = cidadeRepository.findById(id).orElseThrow(() -> new RuntimeException("Cidade não encontrada"));
        estradaRepository.deleteByCidadeAOrCidadeB(cidade , cidade);
        cidadeRepository.delete(cidade);
        return "Cidade Removida com Sucesso";
    }


}
