package community_health.com.communityHealth.checkin.service;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.checkin.model.Comment;
import community_health.com.communityHealth.checkin.repository.CommentRepository;
import community_health.com.communityHealth.checkin.repository.CheckinRepository;
import community_health.com.communityHealth.usuario.model.User;
import community_health.com.communityHealth.usuario.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CheckinRepository checkinRepository;
    private final UserService userService;

    @Autowired
    public CommentService(CommentRepository commentRepository, CheckinRepository checkinRepository, UserService userService) {
        this.commentRepository = commentRepository;
        this.checkinRepository = checkinRepository;
        this.userService = userService;
    }

    /**
     * Cria um novo comentário ou reação em um Check-in.
     */
    @Transactional
    public Comment createComment(Comment commentData, Long checkinId, Long userId) {

        // 1. Validar e carregar o Check-in
        Checkin checkin = checkinRepository.findById(checkinId)
                .orElseThrow(() -> new EntityNotFoundException("Checkin não encontrado com ID: " + checkinId));

        // 2. Validar e carregar o Usuário
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário (Comentarista) não encontrado com ID: " + userId));

        // 3. Associar os objetos
        commentData.setCheckin(checkin);
        commentData.setUser(user);

        // 4. Salvar
        return commentRepository.save(commentData);
    }

    // Método para carregar comentários de um Check-in (para a tela de detalhes)
    @GetMapping
    public List<Comment> getCommentsByCheckinId(Long checkinId) {
        return commentRepository.findByCheckinIdOrderByCreatedAtAsc(checkinId);
    }
}