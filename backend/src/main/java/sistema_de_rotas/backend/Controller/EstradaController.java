package sistema_de_rotas.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema_de_rotas.backend.Dto.Estrada.EstradaRequestDTO;
import sistema_de_rotas.backend.Dto.Estrada.EstradaResponseDTO;
import sistema_de_rotas.backend.Service.EstradaService;

import java.util.List;

@RestController
@RequestMapping("api/estradas")
public class EstradaController {
    private final EstradaService estradaService;

    public EstradaController(EstradaService estradaService) {
        this.estradaService = estradaService;
    }

    @GetMapping
    public ResponseEntity<List<EstradaResponseDTO>> listarEstradas() {
        return ResponseEntity.ok(estradaService.listarTodasAsEstradas());

    }

    @GetMapping("{id}")
    public ResponseEntity<EstradaResponseDTO> selecionarEstrada(@PathVariable Long id) {
        return ResponseEntity.ok(estradaService.listarEstrada(id));
    }

    @PostMapping
    public ResponseEntity<EstradaResponseDTO> cadastrarEstrada(@RequestBody EstradaRequestDTO dto) {
        return ResponseEntity.status(201).body(estradaService.cadastrarEstrada(dto));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deletarEstrada(@PathVariable Long id) {
        return ResponseEntity.ok(estradaService.removerEstrada(id));
    }


}
