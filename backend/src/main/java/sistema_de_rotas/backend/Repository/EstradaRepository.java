package sistema_de_rotas.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sistema_de_rotas.backend.Model.Cidade;
import sistema_de_rotas.backend.Model.Estrada;

import java.util.List;

public interface EstradaRepository extends JpaRepository<Estrada, Long> {

    boolean existsByCidadeAAndCidadeB(Cidade cidadeA , Cidade cidadeB);
    List<Estrada> findByCidadeAOrCidadeB(Cidade cidadeA, Cidade cidadeB);

    void deleteByCidadeAOrCidadeB(Cidade cidade, Cidade cidade1);


}
