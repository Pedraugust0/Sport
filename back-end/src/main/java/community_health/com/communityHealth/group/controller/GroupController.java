package community_health.com.communityHealth.group.controller;

import community_health.com.communityHealth.group.dto.RankingDto;
import community_health.com.communityHealth.group.dto.GroupStatsDto; // 🔑 Importe o DTO
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.model.GroupMember;
import community_health.com.communityHealth.group.service.GroupService;
import community_health.com.communityHealth.utils.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

record ImageUpdateDto(String imageUrl) {}

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    /**
     * POST /api/groups
     * Cria grupo com imagem
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createGroup(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("duration") Integer duration,
            @RequestParam("isPrivate") Boolean isPrivate,
            @RequestParam("ownerId") Long ownerId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            Group newGroup = groupService.createGroupWithImage(name, description, duration, isPrivate, ownerId, file);
            return new ResponseEntity<>(newGroup, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar grupo: " + e.getMessage());
        }
    }

    /**
     * GET /api/groups
     */
    @GetMapping
    public ResponseEntity<List<Group>> getGroups(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            // Retorna meus grupos (dono ou membro)
            return ResponseEntity.ok(groupService.findGroupsForUser(userId));
        }

        // Retorna lista vazia
        return ResponseEntity.ok(List.of());
    }

    /**
     * GET /api/groups/{groupId}/ranking
     * Retorna a lista de RankingDto (Estatísticas por membro)
     */
    @GetMapping("/{groupId}/ranking")
    public ResponseEntity<List<RankingDto>> getGroupRanking(@PathVariable Long groupId) {
        try {
            List<RankingDto> ranking = groupService.getGroupRanking(groupId);
            return ResponseEntity.ok(ranking);
        } catch (Exception e) {
            System.err.println("Erro ao buscar ranking: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{groupId}/image")
    public ResponseEntity<Group> updateGroupImage(
            @PathVariable Long groupId,
            @RequestBody ImageUpdateDto imageUpdateDto) {
        try {
            Group updatedGroup = groupService.updateImageUrl(groupId, imageUpdateDto.imageUrl());
            return ResponseEntity.ok(updatedGroup);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadGroupImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Arquivo vazio.", HttpStatus.BAD_REQUEST);
        }
        try {
            String imageUrl = FileUploadUtil.saveFile(file);
            return new ResponseEntity<>(imageUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Falha ao salvar a imagem: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 🔑 NOVO ENDPOINT: GET /api/groups/{groupId}/members
     * Retorna a lista de GroupMember, que o frontend espera para a classificação.
     */
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMember>> getGroupMembers(@PathVariable Long groupId) {
        try {
            List<GroupMember> members = groupService.findGroupMembersByGroupId(groupId);
            return ResponseEntity.ok(members);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Erro ao buscar membros: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 🔑 NOVO ENDPOINT: GET /api/groups/{groupId}/stats
     * Retorna o DTO de estatísticas globais do grupo.
     */
    @GetMapping("/{groupId}/stats")
    public ResponseEntity<GroupStatsDto> getGroupStats(@PathVariable Long groupId) {
        try {
            GroupStatsDto stats = groupService.calculateGroupStats(groupId);
            return ResponseEntity.ok(stats);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Erro ao buscar estatísticas: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}