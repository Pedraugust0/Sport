package community_health.com.communityHealth.usuario.service;

import community_health.com.communityHealth.usuario.model.User;
import community_health.com.communityHealth.usuario.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    /** Caminho para a pasta uploads (pasta para guardar mídia) que está na raiz do projeto back-end */
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Cria um usuário no sistema
     *
     * @param user Usuário para ser salvo no sistema
     * @return O usuário salvo
     */
    @Transactional
    public User createUser(User user) {
        return this.userRepository.save(user);
    }

    /**
     * Pega todos os usuários salvos cadastrados
     *
     * @return List(User) Todos os usuários cadastrados
     */
    public List<User> getAllUsers() {
        return this.userRepository.findAll();
    }

    /**
     * Pega um usuário pelo seu Id
     *
     * @param id id do usuário para buscar
     * @return User Usuário encontrado pelo id
     */
    public Optional<User> getUserById(Long id) {
        return this.userRepository.findById(id);
    }

    /**
     * Atualiza um usuário no sistema
     *
     * @param id id do usuário que será atualizado
     * @param userDetails usuário para ser atualizado
     * @return User Usuário novo após a atualização
     */
    @Transactional
    public Optional<User> updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(existingUser -> {

            existingUser.setName(userDetails.getName());
            existingUser.setEmail(userDetails.getEmail());

            if(userDetails.getLevel() != null) {
                existingUser.setLevel(userDetails.getLevel());
            }

            return userRepository.save(existingUser);
        });
    }

    /**
     * Remove um usuário no sistema
     *
     * @param id id do usuário que será removido
     * @return boolean para se foi removido ou não
     */
    @Transactional
    public boolean deleteUser(Long id) {

        Optional<User> fetchedUser = this.userRepository.findById(id);

        if (fetchedUser.isPresent()) {
            User user = fetchedUser.get();

            // Apaga a foto do disco
            deleteOldPhoto(user.getPhotoUrl());

            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Adicionar a foto do usuário (precisa de um método especial por conta do multipart file
     *
     * @param userId Id do usuário que terá a foto setada
     * @param file Foto que será setada como a do usuário
     *
     * @return String que será a url para o endpoint da API de fotos de usuário
     *
     * */
    public String uploadUserPhoto(Long userId, MultipartFile file) {

        //Verifica se o usuário existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + userId));

        // Se o usuário já tem foto, apaga a antiga do disco!
        if (user.getPhotoUrl() != null) {
            deleteOldPhoto(user.getPhotoUrl());
        }

        try {
            // Cria a pasta 'uploads' se ela não existir
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }

            // Gera um nome único para o arquivo (UUID + extensão original) para não ocorrer de duas "foto.png" entrarem em conflito
            // Ex: "550e8400-e29b... .jpg"
            String extension = this.getFileExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + extension;

            // Salva o arquivo no disco (Copia o fluxo de dados) e se preciso ele sobrescreve o que já existir
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Gera a URL de download (Ex: http://localhost:8080/uploads/nome-do-arquivo.jpg)
            String fileDownloadUri = fileNameToDownloadUri(fileName);

            // Atualiza o usuário no sistema com a nova URL
            user.setPhotoUrl(fileDownloadUri);
            userRepository.save(user);

            return fileDownloadUri;

        } catch (IOException ex) {
            throw new RuntimeException("Não foi possível salvar o arquivo. Tente novamente!", ex);
        }
    }

    /**
     * Recebe uma string que é o nome de um arquivo e retorna a sua extensão
     *
     * ex: foto.png retorna .png
     *
     * @param fileName Nome do arquivo como String
     * @return String que é a extensão
     * */
    private String getFileExtension(String fileName) {
        String extension = "";

        if (fileName != null && fileName.contains(".")) {
            // Pega tudo a partir do último '.' da extensão para frente (.jpeg, .png)
            extension = fileName.substring(fileName.lastIndexOf("."));
        }

        return extension;
    }

    /**
     * Retorna a URI de download de um arquivo a partir do seu nome ex:
     * foto.png retorna http://localhost:8080/uploads/foto.png
     *
     * @param fileName Nome do arquivo (foto.png)
     *
     * @return String que é a URI de download dessa foto
     */
    private String fileNameToDownloadUri(String fileName) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();
    }

    /**
     * Apaga uma foto antiga a partir da sua Url
     * @param photoUrl url da foto
     * */
    private void deleteOldPhoto(String photoUrl) {
        if (photoUrl == null || photoUrl.isEmpty()) {
            return; // Se não tem foto, não faz nada
        }

        try {
            // Extrai somente o nome do arquivo da url
            String filename = photoUrl.substring(photoUrl.lastIndexOf("/") + 1);

            // Monta o caminho: uploads/nome-do-arquivo.jpg
            Path filePath = this.fileStorageLocation.resolve(filename);

            Files.deleteIfExists(filePath);

        } catch (IOException e) {
            System.err.println("Erro ao deletar foto antiga: " + e.getMessage());
            // Não lançar erro para não comprometer o upload de algo, somente remove se tiver ou se der
        }
    }
}