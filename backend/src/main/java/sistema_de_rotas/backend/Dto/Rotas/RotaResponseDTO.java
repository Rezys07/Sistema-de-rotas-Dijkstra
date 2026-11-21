package sistema_de_rotas.backend.Dto.Rotas;

import sistema_de_rotas.backend.Model.Cidade;

import java.util.List;

public record RotaResponseDTO(
        List<Cidade> caminho, double distanciaTotal
) {
}
