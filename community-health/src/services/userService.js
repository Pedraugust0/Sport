// Service para se Comunicar com a API do Back-End //

const API_URL = "http://localhost:8080/api/users";

/**
 * Pega a lista de usuários cadastrados no sistema
 * * @returns Lista de usuários ou uma lista vazia
 */
export async function getUsers() {
    const res = await fetch(`${API_URL}`);
    return res.json();
}

/**
 * Pega o usuário cadastrado no sistema por Id
 * * @param id id do usuário, é um long
 * @returns o usuário se encontrar, se não null
 */
export async function getUserById(id) {
    const res = await fetch(`${API_URL}/${id}`);

    if (res.status !== 200) return null;

    return res.json();
}

/**
 * Cadastra os dados de texto de um novo usuário (SEM A FOTO)
 * @param data Objeto JS com os dados do usuário
 * @returns O usuário cadastrado com o ID gerado
 */
export async function createUser(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao cadastrar usuário");

    return res.json();
}

/**
 * Atualiza os dados de um usuário existente
 * @param id id do usuário, é um long
 * @param data Objeto JS com os novos dados
 * @returns O usuário atualizado
 */
export async function updateUser(id, data) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

/**
 * Função Composta: Cria o usuário e, se tiver sucesso, envia a foto.
 * Essa é a função que você deve chamar no botão "Salvar" do formulário.
 * * @param userData Objeto com dados do usuário (nome, email, etc)
 * @param photoFile Arquivo de foto (opcional)
 */
export async function createUserWithPhoto(userData, photoFile) {
    try {
        // Cria o usuário no Sistema
        const newUser = await createUser(userData);

        // Se tiver foto e o usuário foi criado, faz o upload
        if (photoFile && newUser.id) {
            await uploadUserPhoto(newUser.id, photoFile);

            // --- A CORREÇÃO AQUI ---

            // Adiciona a URL da foto ao objeto antes de devolver para a tela.
            // O "?t=" é para evitar cache do navegador (força o carregamento da nova imagem)
            newUser.photoUrl = `${API_URL}/${newUser.id}/photo?t=${new Date().getTime()}`;

            newUser.blobUrl = URL.createObjectURL(photoFile);
        }

        return newUser;

    } catch (error) {
        console.error("Erro no processo de criação:", error);
        throw error;
    }
}

/**
 * Atualiza os dados de um usuário e, opcionalmente, substitui sua foto de perfil.
 * 
 * @param id O ID do usuário a ser atualizado
 * @param userData Objeto JS com os novos dados de texto (nome, email, etc)
 * @param newPhotoFile (Opcional) O novo arquivo de imagem. Se não for passado, a foto antiga é mantida.
 * @returns O objeto do usuário atualizado (já com a URL da nova foto injetada para atualização visual imediata)
 */
export async function updateUserWithPhoto(id, userData, newPhotoFile) {
    try {
        // Atualiza os dados de texto
        const updatedUser = await updateUser(id, userData);

        // Se tiver uma NOVA foto, faz o upload
        if (newPhotoFile) {
            await uploadUserPhoto(id, newPhotoFile);
            
            // Atualiza a URL para refletir a nova imagem imediatamente
            // O timestamp (?t=...) garante que o navegador não mostre a foto antiga do cache
            updatedUser.photoUrl = `${API_URL}/${id}/photo?t=${new Date().getTime()}`;
            updatedUser.blobUrl = URL.createObjectURL(newPhotoFile);
        }

        return updatedUser;
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        throw error;
    }
}

/**
 * Pega a foto de perfil do usuário e retorna uma URL para ser usada no <img src="">
 * * @param id ID do usuário
 * @returns Uma URL temporária (Blob) da imagem ou uma imagem padrão se falhar
 */
export async function getUserPhoto(id) {
    try {
        const res = await fetch(`${API_URL}/${id}/photo`);

        if (!res.ok) throw new Error("Foto não encontrada");

        // Converte a resposta binária em um Blob
        const imageBlob = await res.blob();

        // Cria uma URL local para esse blob (Ex: blob:http://localhost:...)
        const imageObjectURL = URL.createObjectURL(imageBlob);

        return imageObjectURL;
    } catch (error) {
        console.error(error);
        return "/assets/default-avatar.png"; // Caminho para uma imagem padrão no front
    }
}