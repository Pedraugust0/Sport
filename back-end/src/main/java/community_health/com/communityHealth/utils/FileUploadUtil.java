package community_health.com.communityHealth.utils;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

public class FileUploadUtil {

    // Diretório de armazenamento (Crie a pasta 'uploads/' na raiz do projeto)
    private static final String UPLOAD_DIR = "back-end/uploads/";
    // URL de acesso público (Será usada para a tag <img> no frontend)
    private static final String BASE_URL = "http://localhost:8080/uploads/";

    public static String saveFile(MultipartFile file) throws IOException {
        // 1. Garante que o diretório 'uploads/' exista
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2. Cria um nome de arquivo único para evitar conflitos
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // 3. Salva o arquivo no disco
        Files.copy(file.getInputStream(), filePath);

        // 4. Retorna a URL pública
        return BASE_URL + uniqueFilename;
    }
}