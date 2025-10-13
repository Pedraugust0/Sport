package repository;

import model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //==========Métodos para autenticação e registro de usuário===========
    //findByEmail(Realiza uma consulta no banco "SELECT * FROM usuario WHEN email = ?")
    Optional<Usuario> findByEmail(String email);

    //Verifica se o email já existe
    boolean existsByEmail(String email);


    //Perfis de usuários para conexão
    List<Usuario> findByNomeContainingIgnoreCase(String nome);



    //============Recomendação de grupo============

    //Busca usuário que praticam o mesmo esporte ou tem o mesmo gosto
    List<Usuario> findByEsportes_NomeIn(List<String> nomeSports);


    //Bucar por localização
    List<Usuario> findByLocalizacao(String localizacao);


    //============Listar usuários em um desafio===========
    /*
    * Busca os usuários que participam do desafio.
    * @param: desafioId, Id do desafio para realizar a busca.
    * @return: Retorna os participantes do desafio buscado.
    * */

    List<Usuario> findByDesafios_Id(Long desafioId);

}
