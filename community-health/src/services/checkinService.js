package community_health.com.communityHealth.checkin.service;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.checkin.repository.CheckinRepository;
import community_health.com.communityHealth.group.model.Group; // Novo Import
import community_health.com.communityHealth.group.repository.GroupRepository; // Novo Import
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException; // Novo Import
import java.util.UUID; // Novo Import

@Service
public class CheckinService {

    private final CheckinRepository checkinRepository;
    private final GroupRepository groupRepository; // Injetado para buscar o Grupo

    @Autowired
    public CheckinService(CheckinRepository checkinRepository, GroupRepository groupRepository) {
        this.checkinRepository = checkinRepository;
        this.groupRepository = groupRepository;
    }

    // Método para salvar um novo Check-in (RECEBE O groupId)
    @Transactional
    public Checkin createCheckin(Checkin checkin, UUID groupId) {

        // 1. Validar e carregar o Group
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Grupo não encontrado com ID: " + groupId));

        // 2. Definir o Group na entidade Checkin antes de salvar
        checkin.setGroup(group);

        // 3. Validação (do código anterior)
        if (checkin.getTituloAtividade() == null || checkin.getTituloAtividade().trim().isEmpty()) {
            throw new IllegalArgumentException("O título da atividade é obrigatório.");
        }

        // 4. Salva no banco de dados
        return checkinRepository.save(checkin);
    }

    // Método para buscar check-ins (exemplo)
    public Checkin getCheckinById(Long id) {
        // Retorna o Checkin ou lança uma exceção se não for encontrado
        return checkinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Checkin não encontrado com ID: " + id));
    }
}