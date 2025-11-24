package community_health.com.communityHealth.user.service;

import community_health.com.communityHealth.user.dto.UserRegisterDTO;
import community_health.com.communityHealth.user.dto.UserUpdateDTO;
import community_health.com.communityHealth.user.model.User;
import community_health.com.communityHealth.user.repository.UserRepository;
import community_health.com.communityHealth.utils.FileUploadUtil; // 🆕 Novo Import
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registra um novo usuário com senha hasheada
     *
     * @param registerDto Dados de registro do usuário
     * @return O usuário salvo
     */
    @Transactional
    public User registerNewUser(UserRegisterDTO registerDto) {
        if (userRepository.findByEmail(registerDto.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        User newUser = new User();
        newUser.setName(registerDto.name());
        newUser.setIdade(registerDto.idade());
        newUser.setCidade(registerDto.cidade());
        newUser.setEmail(registerDto.email());
        newUser.setLevel(1);

        // Hasheia a senha antes de salvar
        String encodedPassword = passwordEncoder.encode(registerDto.password());
        newUser.setPasswordHash(encodedPassword);

        return userRepository.save(newUser);
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
    public User updateUser(Long id, UserUpdateDTO userDetails) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        existingUser.setName(userDetails.name());
        existingUser.setIdade(userDetails.idade());
        existingUser.setCidade(userDetails.cidade());
        existingUser.setEmail(userDetails.email());

        // Nível e PhotoUrl podem ser atualizados se o DTO não for null
        if(userDetails.level() != null) {
            existingUser.setLevel(userDetails.level());
        }
        if(userDetails.photoUrl() != null) {
            existingUser.setPhotoUrl(userDetails.photoUrl());
        }

        return userRepository.save(existingUser);
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

            // Apaga a foto do disco (usando o utilitário)
            deleteOldPhoto(user.getPhotoUrl());

            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Adicionar a foto do usuário (agora usando FileUploadUtil)
     *
     * @param userId Id do usuário que terá a foto setada
     * @param file Foto que será setada como a do usuário
     *
     * @return String que será a url para o endpoint da API de fotos de usuário
     *
     * */
    @Transactional
    public String uploadUserPhoto(Long userId, MultipartFile file) {

        // Verifica se o usuário existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + userId));

        try {
            // 1. Se o usuário já tem foto, apaga a antiga do disco!
            if (user.getPhotoUrl() != null) {
                deleteOldPhoto(user.getPhotoUrl());
            }

            // 2. Salva o novo arquivo e obtém a URL pública (usando o utilitário)
            String fileDownloadUri = FileUploadUtil.saveFile(file);

            // 3. Atualiza o usuário no sistema com a nova URL
            user.setPhotoUrl(fileDownloadUri);
            userRepository.save(user);

            return fileDownloadUri;

        } catch (IOException ex) {
            // Lança uma exceção de tempo de execução, embrulhando a IOException
            throw new RuntimeException("Não foi possível salvar o arquivo. Tente novamente!", ex);
        }
    }

    /**
     * Apaga uma foto antiga a partir da sua Url (agora usando FileUploadUtil)
     * @param photoUrl url da foto
     * */
    private void deleteOldPhoto(String photoUrl) {
        try {
            // Usa o utilitário para deletar
            FileUploadUtil.deleteFileByUrl(photoUrl);
        } catch (IOException e) {
            // Apenas registra o erro, não lança exceção para não interromper a exclusão do usuário
            System.err.println("Erro ao deletar foto antiga: " + e.getMessage());
        }
    }
}