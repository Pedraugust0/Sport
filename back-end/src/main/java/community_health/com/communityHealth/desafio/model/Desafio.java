package community_health.com.communityHealth.desafio.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "Desafios")
public class Desafio {

    @Id
    private Long id;

}
