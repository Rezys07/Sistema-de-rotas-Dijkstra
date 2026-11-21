package sistema_de_rotas.backend.Service;

import sistema_de_rotas.backend.Model.Cidade;

public record CidadeDistancia(Cidade cidade , double distancia) implements Comparable<CidadeDistancia> {
    @Override
    public int compareTo(CidadeDistancia outra) {
        return Double.compare(this.distancia , outra.distancia);
    }
}
