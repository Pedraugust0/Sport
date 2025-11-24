package community_health.com.communityHealth.group.controller;

import community_health.com.communityHealth.group.dto.RankingDto;
import community_health.com.communityHealth.group.model.Group;
import community_health.com.communityHealth.group.service.GroupService;
import community_health.com.communityHealth.utils.FileUploadUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

// 🔑 NOVO: DTO simples para receber a URL do JSON (necessário para PUT/PATCH)
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
     * Endpoint para criar um novo grupo (Dados JSON).
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
     * 🆕 NOVO ENDPOINT: Atualiza a URL da imagem de um grupo existente.
     * Mapeado para: PUT /api/groups/{groupId}/image
     */
    @PutMapping("/{groupId}/image")
    public ResponseEntity<Group> updateGroupImage(
            @PathVariable Long groupId,
            @RequestBody ImageUpdateDto imageUpdateDto) { // Recebe o DTO com a nova URL
        try {
            // Chama o serviço para atualizar a URL (o GroupService deve conter a lógica de salvar)
            Group updatedGroup = groupService.updateImageUrl(groupId, imageUpdateDto.imageUrl());
            return ResponseEntity.ok(updatedGroup); // Retorna 200 OK com o grupo atualizado
        } catch (EntityNotFoundException e) {
            // Se o grupo não for encontrado, retorna 404
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Erro ao atualizar foto do grupo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    /**
     * 🆕 NOVO ENDPOINT: Faz o upload da imagem do grupo e retorna a URL pública.
     * Recebe a requisição MultiPart do frontend ANTES da criação final do grupo.
     * URL: POST /api/groups/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadGroupImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Arquivo vazio.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 🔑 Salva o arquivo no disco e obtém a URL pública (usando a classe utilitária)
            String imageUrl = FileUploadUtil.saveFile(file);

            // Retorna a URL para o frontend.
            return new ResponseEntity<>(imageUrl, HttpStatus.OK);

        } catch (IOException e) {
            System.err.println("Erro ao salvar arquivo de imagem: " + e.getMessage());
            return new ResponseEntity<>("Falha ao salvar a imagem. Erro: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
}