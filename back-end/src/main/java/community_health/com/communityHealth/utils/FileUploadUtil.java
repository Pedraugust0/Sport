package community_health.com.communityHealth.utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class FileUploadUtil {

    // Diretório de armazenamento
    private static final String UPLOAD_DIR = "back-end/uploads/";
    // URL de acesso público no front-end
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    public static String saveFile(MultipartFile file) throws IOException {
        // Garante que o diretório exista
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Pega a extensão do arquivo
        String originalFilename = file.getOriginalFilename();
        String fileExtension;

        if(originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            fileExtension = "";
        }

        // Cria um nome de arquivo único para evitar conflitos
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Salva o arquivo no disco
        Files.copy(file.getInputStream(), filePath);

        // Retorna a URL pública
        return BASE_URL + uniqueFilename;
    }

    /**
     * Deleta o arquivo do disco usando a URL pública.
     * @param photoUrl URL pública da foto.
     * @throws IOException Se a exclusão falhar.
     */
    public static void deleteFileByUrl(String photoUrl) throws IOException {
        if (photoUrl == null || photoUrl.isEmpty()) {
            return;
        }

        String filename = photoUrl.substring(BASE_URL.length());

        // Monta o caminho completo no disco
        Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);

        Files.deleteIfExists(filePath);
    }
}