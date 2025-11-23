package community_health.com.communityHealth.group.controller;

import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.service.GroupService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    /**
     * Endpoint para criar um novo grupo.
     * Neste exemplo, o ownerId é passado como um parâmetro de query.
     * Em um ambiente real, você o pegaria do token JWT.
     * POST /api/groups?ownerId={ownerId}
     */
    @PostMapping
    public ResponseEntity<Group> createGroup(
            @RequestBody Group groupData,
            @RequestParam Long ownerId) {
        try {
            Group newGroup = groupService.createGroup(groupData, ownerId);
            return new ResponseEntity<>(newGroup, HttpStatus.CREATED); // Retorna 201 Created
        } catch (EntityNotFoundException e) {
            // Se o Owner não for encontrado
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Retorna 400 Bad Request
        }
    }

    /**
     * Endpoint para listar todos os grupos.
     * GET /api/groups
     */
    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> publicGroups = groupService.findAllGroups();
        return new ResponseEntity<>(publicGroups, HttpStatus.OK);
    }
}