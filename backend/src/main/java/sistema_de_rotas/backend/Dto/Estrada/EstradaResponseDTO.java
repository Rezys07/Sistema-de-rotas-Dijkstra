package sistema_de_rotas.backend.Dto.Estrada;

import sistema_de_rotas.backend.Model.Cidade;

public record EstradaResponseDTO(Long id, Cidade cidadeA , Cidade cidadeB , double distanciaKm) {
}
