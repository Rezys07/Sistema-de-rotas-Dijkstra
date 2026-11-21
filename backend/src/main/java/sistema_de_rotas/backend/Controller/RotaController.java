package sistema_de_rotas.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sistema_de_rotas.backend.Dto.Rotas.RotaResponseDTO;
import sistema_de_rotas.backend.Service.DijkstraService;

@RestController
@RequestMapping("api/rotas")
public class RotaController {
    private final DijkstraService dijkstraService;

    public RotaController(DijkstraService dijkstraService) {
        this.dijkstraService = dijkstraService;
    }

    // GET http://localhost:8080/api/rotas?origem=1&destino=2
    @GetMapping
    public ResponseEntity<RotaResponseDTO> calcularTotal(
            @RequestParam Long origem,
            @RequestParam Long destino
    ) {
        RotaResponseDTO rota = dijkstraService.calcularRota(origem , destino);
        return ResponseEntity.ok(rota);
    }
}
