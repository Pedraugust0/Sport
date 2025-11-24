const API_URL = "http://localhost:8080/api/groups";

/**
 * Cria um novo grupo enviando dados + imagem via Multipart/Form-Data.
 * O FormData deve conter: name, description, duration, isPrivate, ownerId e file (opcional).
 */
export async function createGroup(groupData) {
    const formData = new FormData();

    // Adiciona os campos de texto obrigatórios e opcionais
    formData.append("name", groupData.name);
    formData.append("description", groupData.description || "");
    formData.append("duration", groupData.duration); // Backend espera Integer
    formData.append("isPrivate", groupData.isPrivate);
    formData.append("ownerId", groupData.ownerId); // ID do usuário logado

    // Adiciona o arquivo da imagem se existir
    // O backend espera receber um campo chamado "file"
    if (groupData.imageFile) {
        formData.append("file", groupData.imageFile);
    }

    const res = await fetch(API_URL, {
        method: "POST",
        body: formData, 
        // O navegador define 'multipart/form-data' automaticamente com o boundary correto.
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao criar grupo.");
    }

    return res.json();
}

/**
 * Busca todos os grupos do banco de dados.
 */
export async function getGroups() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar grupos.");
    return res.json();
}

/**
 * Busca um grupo específico pelo ID.
 */
export async function getGroupById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Grupo não encontrado.");
    return res.json();
}