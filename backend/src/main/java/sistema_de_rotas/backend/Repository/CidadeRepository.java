package sistema_de_rotas.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sistema_de_rotas.backend.Model.Cidade;

public interface CidadeRepository extends JpaRepository<Cidade, Long> {
    boolean existsByNameIgnoreCase(String name);
}
