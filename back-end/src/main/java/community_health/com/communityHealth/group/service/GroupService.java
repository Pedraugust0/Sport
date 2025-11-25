package community_health.com.communityHealth.group.service;

import community_health.com.communityHealth.checkin.repository.CheckinRepository;
import community_health.com.communityHealth.group.dto.GroupStatsDto;
import community_health.com.communityHealth.group.dto.RankingDto;
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.model.GroupMember;
import community_health.com.communityHealth.group.repository.GroupMemberRepository; // 🔑 Usado para buscar membros
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
    private final GroupMemberRepository groupMemberRepository; // 🔑 Repositório de Membros injetado

    @Autowired
    public GroupService(GroupRepository groupRepository, UserService userService, CheckinRepository checkinRepository, GroupMemberRepository groupMemberRepository) {
        this.groupRepository = groupRepository;
        this.userService = userService;
        this.checkinRepository = checkinRepository;
        this.groupMemberRepository = groupMemberRepository;
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

    /**
     * Busca os grupos nos quais o usuário é dono ou membro.
     */
    public List<Group> findGroupsForUser(Long userId) {
        return groupRepository.findMyGroups(userId);
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

    // ----------------------------------------------------------------------
    // MÉTODOS DE DADOS PARA O FRONTEND
    // ----------------------------------------------------------------------

    /**
     * 🔑 IMPLEMENTAÇÃO FINAL: Retorna a lista de GroupMember para o endpoint /members.
     * @param groupId ID do grupo.
     * @return Lista de GroupMember.
     */
    public List<GroupMember> findGroupMembersByGroupId(Long groupId) {
        // Usamos o método implementado no GroupMemberRepository
        return groupMemberRepository.findByGroupId(groupId);
    }

    /**
     * Busca o ranking de check-ins e dias ativos por membro.
     * Usado para a classificação do frontend.
     * @param groupId ID do grupo.
     * @return Lista de RankingDto (Estatísticas por membro).
     */
    public List<RankingDto> getGroupRanking(Long groupId) {
        // A query em CheckinRepository já filtra por grupo e calcula as métricas.
        return checkinRepository.findRankingByGroupId(groupId);
    }

    /**
     * Calcula estatísticas globais do grupo para o endpoint /stats.
     */
    public GroupStatsDto calculateGroupStats(Long groupId) {
        // 1. Obter o Ranking Completo (já contém os dados agregados por usuário)
        List<RankingDto> ranking = this.getGroupRanking(groupId);

        // Se o grupo não tiver membros/ranking, retorna 0 ou lança exceção.
        if (ranking.isEmpty()) {
            GroupStatsDto stats = new GroupStatsDto();
            stats.setTotalCheckins(0);
            stats.setTotalActiveDays(0);
            stats.setAvgCheckinsPerDay(0.0);
            return stats;
        }

        // 2. Calcular o Total de Checkins do Grupo
        long totalCheckins = ranking.stream()
                .mapToLong(RankingDto::totalCheckins)
                .sum();

        // 3. Obter o total de dias ativos de todos os membros somados
        int totalActiveDays = ranking.stream()
                .mapToInt(r -> (int) r.activeDays())
                .sum();

        // 4. Calcular a Média de Checkins (Total de checkins / número de membros)
        Double avgCheckinsPerMember = (double) totalCheckins / ranking.size();

        // 5. Mapear para o DTO
        GroupStatsDto stats = new GroupStatsDto();
        stats.setTotalCheckins((int) totalCheckins);
        stats.setTotalActiveDays(totalActiveDays);
        stats.setAvgCheckinsPerDay(avgCheckinsPerMember);

        return stats;
    }
}