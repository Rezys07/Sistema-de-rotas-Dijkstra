package sistema_de_rotas.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema_de_rotas.backend.Dto.Cidade.CidadeRequestDTO;
import sistema_de_rotas.backend.Dto.Cidade.CidadeResponseDTO;
import sistema_de_rotas.backend.Service.CidadeService;

import java.util.List;

@RestController
@RequestMapping("api/cidades")
public class CidadeController {
    private final CidadeService cidadeService;

    public CidadeController(CidadeService cidadeService) {
        this.cidadeService = cidadeService;
    }

    @GetMapping
    public ResponseEntity<List<CidadeResponseDTO>> listar() {
        return ResponseEntity.ok(cidadeService.listarTodasAsCidades());
    }

    @GetMapping("{id}")
    public ResponseEntity<CidadeResponseDTO> selecionarCidade(@PathVariable Long id) {
        return ResponseEntity.ok(cidadeService.listarCidade(id));
    }

    @PostMapping
    public ResponseEntity<CidadeResponseDTO> cadastrar(@RequestBody CidadeRequestDTO dto) {
        return  ResponseEntity.status(201).body(cidadeService.cadastrar(dto));

    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<String> remover(@PathVariable Long id) {
        return ResponseEntity.ok(cidadeService.removerCidade((id)));
    }

}
