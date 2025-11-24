package community_health.com.communityHealth.checkin.controller;

import community_health.com.communityHealth.checkin.model.Checkin;
import community_health.com.communityHealth.checkin.service.CheckinService;
import community_health.com.communityHealth.utils.FileUploadUtil; // 🔑 Importar o utilitário
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // 🔑 Importar para upload
import java.io.IOException;

import java.util.List;

@RestController
@RequestMapping("/api/checkins")
public class CheckinController {

    private final CheckinService checkinService;

    @Autowired
    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    /**
     * Endpoint para criar um novo Check-in (Dados JSON).
     * O 'Checkin' recebido pode conter o photoUrl pré-preenchido.
     */
    @PostMapping
    public ResponseEntity<Object> createCheckin(
            @RequestBody Checkin checkin,
            @RequestParam Long groupId,
            @RequestParam(defaultValue = "1") Long userId) {
        try {
            Checkin createdCheckin = checkinService.createCheckin(checkin, groupId, userId);

            return new ResponseEntity<>(createdCheckin, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>("Grupo não encontrado ou Usuário não encontrado.", HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            return new ResponseEntity<>("Erro interno ao criar checkin.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 🆕 NOVO ENDPOINT: Faz o upload da imagem do Check-in e retorna a URL pública.
     * URL: POST /api/checkins/upload
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadCheckinImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Arquivo vazio.", HttpStatus.BAD_REQUEST);
        }

        try {
            // Reutiliza o utilitário de upload que já configuramos
            String imageUrl = FileUploadUtil.saveFile(file);

            return new ResponseEntity<>(imageUrl, HttpStatus.OK);

        } catch (IOException e) {
            System.err.println("Erro ao salvar arquivo de imagem do Check-in: " + e.getMessage());
            return new ResponseEntity<>("Falha ao salvar a imagem. Erro: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Endpoint GET para buscar Check-ins por ID do grupo.
     */
    @GetMapping
    public ResponseEntity<List<Checkin>> getCheckinsByGroupId(@RequestParam Long groupId) {
        try {
            List<Checkin> checkins = checkinService.getCheckinsByGroupId(groupId);
            return ResponseEntity.ok(checkins);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Exemplo de Endpoint GET para buscar um checkin por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Checkin> getCheckin(@PathVariable Long id) {
        try {
            Checkin checkin = checkinService.getCheckinById(id);
            return ResponseEntity.ok(checkin);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}