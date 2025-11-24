package community_health.com.communityHealth.group.service;

import community_health.com.communityHealth.checkin.repository.CheckinRepository;
import community_health.com.communityHealth.group.dto.RankingDto;
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.repository.GroupRepository;
import community_health.com.communityHealth.usuario.model.User;
import community_health.com.communityHealth.usuario.service.UserService; // Assumindo que você tem um UserService
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserService userService; // Para buscar o Owner
    private final CheckinRepository checkinRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserService userService, CheckinRepository checkinRepository) {
        this.groupRepository = groupRepository;
        this.userService = userService;
        this.checkinRepository = checkinRepository;
    }

    /**
     * Cria um novo grupo, definindo a data de início (startDate) para agora
     * e o Owner (dono) a partir do ID fornecido.
     * @param groupData Dados do grupo a ser criado
     * @param ownerId ID do usuário que está criando o grupo
     * @return O Group criado e salvo no banco
     */
    public Group createGroup(Group groupData, Long ownerId) {
        // 1. Validar e carregar o Owner
        User owner = userService.getUserById(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("Owner (User) not found with id: " + ownerId));

        // 2. Aplicar lógica de negócio na criação
        groupData.setOwner(owner);

        // **IMPORTANTE**: Define a data de início do grupo para o momento da criação
        if (groupData.getStartDate() == null) {
            groupData.setStartDate(LocalDateTime.now());
        }

        // 3. Persistir o objeto
        return groupRepository.save(groupData);
    }


    /**
     * Lista todos os grupos públicos.
     */
    public List<Group> findAllGroups() {
        return groupRepository.findAll();
    }

    public List<RankingDto> getGroupRanking(Long groupId) {
        // A query em CheckinRepository já filtra por grupo e calcula as métricas.
        return checkinRepository.findRankingByGroupId(groupId);
    }

    /**
     * 🆕 NOVO MÉTODO: Atualiza apenas a URL da imagem do grupo no banco de dados.
     */
    @Transactional
    public Group updateImageUrl(Long groupId, String imageUrl) {
        return groupRepository.findById(groupId)
                .map(group -> {
                    group.setImageUrl(imageUrl);
                    return groupRepository.save(group);
                })
                .orElseThrow(() -> new EntityNotFoundException("Grupo não encontrado com ID: " + groupId));
    }
}