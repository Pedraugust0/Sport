package community_health.com.communityHealth.user.controller;

import community_health.com.communityHealth.user.dto.UserResponseDTO;
import community_health.com.communityHealth.user.dto.UserUpdateDTO;
import community_health.com.communityHealth.user.model.User;
import community_health.com.communityHealth.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserRestController {

    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Endpoint para buscar um usuário pelo ID.
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        Optional<User> userBuscado = this.userService.getUserById(id);

        if(userBuscado.isPresent()) {
            User user = userBuscado.get();

            return ResponseEntity.ok(this.userToResponse(user));
        }

        return ResponseEntity.notFound().build();
    }

    /**
     * Endpoint para buscar todos os usuários.
     * GET /api/users
     */
    @GetMapping()
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> listUsers = new ArrayList<>();

        for(User user : this.userService.getAllUsers()) {
            listUsers.add(this.userToResponse(user));
        }

        return ResponseEntity.ok(listUsers);
    }

    /**
     * Endpoint para adicionar/atualizar a foto de um usuário.
     * POST /api/users/{id}/photo
     *
     * @param id Id do usuário que terá a foto adicionada
     * @param file O arquivo enviado do front-end
     * @return A url da foto ou um código 400 + mensagem de erro
     */
    @PostMapping("/{id}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String photoUrl = userService.uploadUserPhoto(id, file);
            return ResponseEntity.ok(photoUrl);
        } catch (EntityNotFoundException e) {
            // Se o usuário não existir
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            // Outros erros (IO, etc.)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestBody UserUpdateDTO userToUpdate, @PathVariable("id") Long id) {
        try {
            User userUpdated = this.userService.updateUser(id, userToUpdate);

            // Retorna o status 200 OK com o DTO de resposta
            return ResponseEntity.ok(this.userToResponse(userUpdated));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Erros como validação de email, etc.
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            // 204 No Content: Sucesso, mas não retorna corpo.
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Converte de entity User para UserResponseDTO
     * @param user Entity para ser convertida
     * @return UserResponseDTO
     * */
    private UserResponseDTO userToResponse(User user) {
        UserResponseDTO userResponse = new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getIdade(), // 🆕 Adicionado
                user.getCidade(), // 🆕 Adicionado
                user.getEmail(),
                user.getPhotoUrl(),
                user.getLevel(),
                user.getCreatedAt()
        );

        return userResponse;
    }
}