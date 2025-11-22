package community_health.com.communityHealth.desafio.repository;

import community_health.com.communityHealth.desafio.model.Desafio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesafioRepository extends JpaRepository<Desafio, Long> {


    //Filtrar desafio por id(pois no banco de dados pode ter desafio com mesmo nome)
    //Método já existe no JPA, basta usar.


    /*
    * Filtra desafios pela quantidade de número exato de participantes
    * @param: 'quantiade'. O número de usuários que o desafio terá
    * @return: Retorna uma lista de desafios com a quantidade de usuários
    * */
    /*@Query("SELECT d FROM Desafios WHERE SIZE(d.usuarios) = :quantidade")
    List<Desafio> findByQauntidadeDeUsuarios(@Param("quantidade") int quantidade);*/

    /*
    * Filtra desafios pela quantidade de participantes sendo igual ou maior ao parâmetro passado.
    * @param: 'quantidade'
    * @return: Retorna uma lista de desafios com o filtro passado sendo igual ou maior
    * */
    /*@Query("SELECT d FROM Desafios WHERE SIZE(d.usuarios) >=:quantidade")
    List<Desafio> findByQuantidadeUsuariosMaiorIgual(@Param("quantidade") int quantidade);*/


    /*
    * Filtra desafios pela quantidade de participantes sendo menor ou igual ao parâmetro
    * @param: 'quantidade'
    * @return: Retorna uma lista de desafios com filtro passado sendo menor ou igual
    * */
    /*@Query("SELECT d FROM Desafios WHERE SIZE(d.usuarios)<=:quantidade")
    List<Desafio> findByQuantidadeUsuariosMenorIgual(@Param("quantidade") int quantidade);*/


    /*
    * Busca desafios com a palavra chave específica
    * @param: 'palavraChave'
    * @return: Retorna uma lista de desafios com a palavra chave
    * */
    /*List<Desafio> findByTituloContainingIgnoreCase(String palavraChave);*/


    //Buscar todos os desafios
    //Já existe, DesafioRepository.findAll();

}
