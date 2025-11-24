package community_health.com.communityHealth.checkin.service;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.checkin.repository.CheckinRepository;
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.repository.GroupRepository;
import community_health.com.communityHealth.user.model.User;
import community_health.com.communityHealth.user.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@Service
public class CheckinService {

    private final CheckinRepository checkinRepository;
    private final GroupRepository groupRepository;
    private final UserService userService; // Injetado

    @Autowired
    public CheckinService(CheckinRepository checkinRepository, GroupRepository groupRepository, UserService userService) {
        this.checkinRepository = checkinRepository;
        this.groupRepository = groupRepository;
        this.userService = userService;
    }

    // Método para salvar um novo Check-in (RECEBENDO userId)
    @Transactional
    public Checkin createCheckin(Checkin checkin, Long groupId, Long userId) { // 🆕 userId ADICIONADO

        // 1. Validar e carregar o Group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Grupo não encontrado com ID: " + groupId));

        // 2. Validar e carregar o User
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + userId));

        // 3. Definir as referências
        checkin.setGroup(group);
        checkin.setUser(user); // 🆕 Definindo o Usuário

        // 4. Validação
        if (checkin.getTituloAtividade() == null || checkin.getTituloAtividade().trim().isEmpty()) {
            throw new IllegalArgumentException("O título da atividade é obrigatório.");
        }

        return checkinRepository.save(checkin);
    }

    // Método para buscar Check-ins por Grupo
    public List<Checkin> getCheckinsByGroupId(Long groupId) {
        return checkinRepository.findByGroupId(groupId);
    }

    // Método para buscar check-ins por ID
    public Checkin getCheckinById(Long id) {
        return checkinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checkin não encontrado com ID: " + id));
    }
}