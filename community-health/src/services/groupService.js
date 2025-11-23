export async function createGroup(groupData, ownerId) {
    const API_URL = "http://localhost:8080/api/groups"; 

    const res = await fetch(`${API_URL}?ownerId=${ownerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData), // groupData deve ser o objeto JS (sem a imagem)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao cadastrar grupo: ${res.status} - ${errorText}`);
    }

    return res.json();
}

//🆕 FUNÇÃO PARA LISTAR GRUPOS (GET)
/**
 * Pega a lista de todos os grupos.
 * Corresponde ao endpoint: GET /api/groups no seu Controller Java.
 * @returns Lista de grupos ou uma lista vazia.
 */
export async function getAllGroups() {
    try {
        const res = await fetch(API_URL);

        if (res.ok) {
            return res.json();
        }
        console.error("Erro ao buscar grupos:", res.status);
        return [];
    } catch (error) {
        console.error("Falha na rede ao buscar grupos:", error);
        return [];
    }
}