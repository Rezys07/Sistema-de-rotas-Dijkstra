package sistema_de_rotas.backend.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Estradas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Estrada {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cidade_a_id", nullable = false)
    private Cidade cidadeA;

    @ManyToOne
    @JoinColumn(name = "cidade_b_id" , nullable = false)
    private Cidade cidadeB;

    @Column(nullable = false)
    @Positive
    private double distanciaKm;

}
