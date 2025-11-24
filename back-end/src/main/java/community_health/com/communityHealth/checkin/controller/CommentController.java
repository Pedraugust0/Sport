package community_health.com.communityHealth.checkin.controller;

import community_health.com.communityHealth.checkin.model.Comment;
import community_health.com.communityHealth.checkin.service.CommentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; // Importar List é essencial para o método GET

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Endpoint POST (Criação): OK.
     * URL: POST /api/comments?checkinId={ID}&userId={ID}
     */
    @PostMapping
    public ResponseEntity<Object> createComment(
            @RequestBody Comment commentData,
            @RequestParam Long checkinId,
            @RequestParam(defaultValue = "1") Long userId) {
        try {
            Comment newComment = commentService.createComment(commentData, checkinId, userId);
            return new ResponseEntity<>(newComment, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            // Retorna 404 se Checkin ou User não forem encontrados
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Erro ao criar comentário: " + e.getMessage());
            return new ResponseEntity<>("Erro interno ao criar comentário.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // -------------------------------------------------------------
    // 🆕 CORREÇÃO: Endpoint GET (Busca por Lista)
    // URL: GET http://localhost:8080/api/comments?checkinId={ID}
    // -------------------------------------------------------------
    @GetMapping // <<< Mapeia a requisição GET
    public ResponseEntity<List<Comment>> getCommentsByCheckinId(@RequestParam Long checkinId) {
        try {
            // Chama o Service para buscar a lista de comentários para o Checkin ID fornecido
            List<Comment> comments = commentService.getCommentsByCheckinId(checkinId);

            // Retorna a lista com status 200 OK
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            System.err.println("Erro ao buscar comentários: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 🆕 NOVO ENDPOINT: Remove uma reação específica de um Check-in.
     * URL: DELETE /api/comments?checkinId={ID}&userId={ID}&emoji={EMOJI}
     */
    @DeleteMapping
    public ResponseEntity<Object> removeReaction(
            @RequestParam Long checkinId,
            @RequestParam(defaultValue = "1") Long userId, // Assume userId=1 por padrão (teste)
            @RequestParam String emoji) {
        try {
            commentService.removeReaction(checkinId, userId, emoji);
            // Retorna 204 No Content para remoção bem-sucedida (sem corpo de resposta)
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (EntityNotFoundException e) {
            // Se a reação não existir para ser removida, retorna 404
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            System.err.println("Erro ao remover reação: " + e.getMessage());
            return new ResponseEntity<>("Erro interno ao remover reação.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}