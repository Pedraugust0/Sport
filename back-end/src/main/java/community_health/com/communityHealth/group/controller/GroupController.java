package community_health.com.communityHealth.group.controller;

import community_health.com.communityHealth.group.dto.RankingDto;
import community_health.com.communityHealth.group.model.Group;
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

// DTO simples para receber a URL do JSON (necessário para PUT/PATCH de imagem via URL direta)
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
     * Endpoint para criar um novo grupo com suporte a arquivo (Multipart).
     * POST /api/groups
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
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body("Usuário (Owner) não encontrado.");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erro ao salvar imagem: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar grupo: " + e.getMessage());
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

    /**
     * Endpoint: Busca a classificação e estatísticas de um grupo.
     * GET /api/groups/{groupId}/ranking
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

    /**
     * Atualiza a URL da imagem de um grupo existente (sem upload de arquivo, apenas string).
     * PUT /api/groups/{groupId}/image
     */
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

    /**
     * Faz o upload da imagem do grupo (endpoint utilitário isolado).
     * POST /api/groups/upload
     */
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
}