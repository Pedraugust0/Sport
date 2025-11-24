const API_URL = "http://localhost:8080/api/users";

// 🔹 Buscar todos os usuários (GET /api/users)
export async function getUsers() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar usuários");
    return res.json();
}

// 🔹 Buscar usuário por ID (GET /api/users/{id})
export async function getUserById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Usuário não encontrado");
    return res.json();
}

export async function getUserByEmail(email) {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar dados do usuário");
    
    const allUsers = await res.json();
    
    // Procura o usuário que tem o mesmo email usado no login
    const foundUser = allUsers.find(u => u.email === email);
    
    if (!foundUser) {
        throw new Error("Usuário não encontrado no sistema.");
    }
    
    return foundUser;
}

// 🔹 Atualizar usuário (PUT /api/users/{id})
export async function updateUser(id, userData) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    
    if (!res.ok) throw new Error("Erro ao atualizar usuário");
    return res.json();
}

// 🔹 Deletar usuário (DELETE /api/users/{id})
export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar usuário");
    return true; // Retorna true se deletou com sucesso (204 No Content)
}

// 🔹 Upload de Foto (POST /api/users/{id}/photo)
export async function uploadUserPhoto(id, file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/${id}/photo`, {
        method: "POST",
        body: formData, // Não definir Content-Type, o navegador define multipart/form-data automaticamente
    });

    if (!res.ok) throw new Error("Erro ao enviar foto");
    return res.text(); // O backend retorna a URL da string
}