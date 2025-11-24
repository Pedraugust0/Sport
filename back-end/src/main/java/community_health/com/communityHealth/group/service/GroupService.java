package community_health.com.communityHealth.group.service;

import community_health.com.communityHealth.checkin.repository.CheckinRepository;
import community_health.com.communityHealth.group.dto.RankingDto;
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.repository.GroupRepository;
import community_health.com.communityHealth.user.model.User;
import community_health.com.communityHealth.user.service.UserService;
import community_health.com.communityHealth.utils.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserService userService;
    private final CheckinRepository checkinRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserService userService, CheckinRepository checkinRepository) {
        this.groupRepository = groupRepository;
        this.userService = userService;
        this.checkinRepository = checkinRepository;
    }

    /**
     * Cria um novo grupo recebendo parâmetros individuais e arquivo de imagem.
     */
    @Transactional
    public Group createGroupWithImage(String name, String description, Integer durationDays, Boolean isPrivate, Long ownerId, MultipartFile file) throws IOException {
        // 1. Validar e carregar o Owner
        User owner = userService.getUserById(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("Owner (User) not found with id: " + ownerId));

        // 2. Instanciar e popular o Grupo
        Group group = new Group();
        group.setName(name);
        group.setDescription(description);
        group.setDurationDays(durationDays);
        group.setIsPrivate(isPrivate);
        group.setOwner(owner);

        // Define data de início agora
        group.setStartDate(LocalDateTime.now());

        // 3. Upload da Imagem (se existir arquivo)
        if (file != null && !file.isEmpty()) {
            String imageUrl = FileUploadUtil.saveFile(file);
            group.setImageUrl(imageUrl);
        }

        // 4. Persistir no banco
        return groupRepository.save(group);
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
     * Atualiza apenas a URL da imagem do grupo no banco de dados.
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