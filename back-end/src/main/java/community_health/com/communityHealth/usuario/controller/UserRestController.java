package community_health.com.communityHealth.usuario.controller;

import community_health.com.communityHealth.usuario.model.User;
import community_health.com.communityHealth.usuario.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserRestController {
    UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userBuscado = this.userService.getUserById(id);

        if(userBuscado.isPresent()) {
            return ResponseEntity.ok(userBuscado.get());
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(this.userService.getAllUsers());
    }

    /**
     * Salva um usuário (SEM A FOTO DE USUÁRIO, PARA ISSO USE O CONTROLLER uploadPhoto LOGO A BAIXO)
     *
     * @param user Usuario a ser salvo
     * @return código de status + o usuário salvo
     *
     * */
    @PostMapping
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        User userSalvo = this.userService.createUser(user);

        return ResponseEntity.status(201).body(userSalvo);
    }

    /**
     * Adiciona uma foto a um usuário já salvo
     *
     * @param id Id do usuário que terá a foto adicionada
     * @param file O arquivo enviado do front-end
     *
     * @return A url da foto ou um código 400 + mensagem de erro
     *
     * */
    @PostMapping("/{id}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            String photoUrl = userService.uploadUserPhoto(id, file);
            return ResponseEntity.ok(photoUrl);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User userToUpdate, @PathVariable("id") Long id) {
        Optional<User> userUpdated = this.userService.updateUser(id, userToUpdate);

        if(userUpdated.isPresent()) return ResponseEntity.status(201).body(userUpdated.get());

        return ResponseEntity.status(400).build();
    }

}
