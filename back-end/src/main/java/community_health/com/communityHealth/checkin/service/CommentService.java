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
import java.util.List;
import java.util.Optional;

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
     * Cria um novo comentário ou reação, aplicando a regra de reação única.
     */
    @Transactional
    public Comment createComment(Comment commentData, Long checkinId, Long userId) {

        // 1. Validar e carregar o Check-in e o Usuário
        Checkin checkin = checkinRepository.findById(checkinId)
                .orElseThrow(() -> new EntityNotFoundException("Checkin não encontrado com ID: " + checkinId));

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário (Comentarista) não encontrado com ID: " + userId));

        // 2. REGRA DE NEGÓCIO: Impedir reações duplicadas
        if (commentData.getContent() == null && commentData.getReactionEmoji() != null) {
            String emoji = commentData.getReactionEmoji();

            // 🔑 A verificação é feita. Se a exclusão anterior comitou, esta deve retornar vazio.
            boolean reactionExists = commentRepository
                    .findByCheckinIdAndUserIdAndReactionEmoji(checkinId, userId, emoji)
                    .isPresent();

            if (reactionExists) {
                // Lança exceção 409 CONFLICT (confirmação da regra)
                throw new RuntimeException("O usuário já reagiu com o emoji '" + emoji + "' neste Check-in.");
            }
        }

        // 3. Associar os objetos
        commentData.setCheckin(checkin);
        commentData.setUser(user);

        // 4. Salvar
        return commentRepository.save(commentData);
    }

    /**
     * 🆕 Método para remover uma reação específica de um usuário.
     * @Transactional garante que o commit da deleção ocorra.
     */
    @Transactional
    public void removeReaction(Long checkinId, Long userId, String emoji) {
        Optional<Comment> existingReaction = commentRepository
                .findByCheckinIdAndUserIdAndReactionEmoji(checkinId, userId, emoji);

        if (existingReaction.isPresent()) {
            commentRepository.delete(existingReaction.get());
        } else {
            throw new EntityNotFoundException("Reação não encontrada para remoção.");
        }
    }

    /**
     * Método para carregar comentários de um Check-in.
     */
    public List<Comment> getCommentsByCheckinId(Long checkinId) {
        return commentRepository.findByCheckinIdOrderByCreatedAtAsc(checkinId);
    }
}