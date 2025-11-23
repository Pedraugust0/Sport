// 🚩 Defina a URL da API no topo do arquivo para que ambas as funções possam acessá-la
const API_URL_BASE = "http://localhost:8080/api";

// ⚠️ USER ID HARDCODED PARA TESTE
const CURRENT_USER_ID = 1;

// =============================================================
// FUNÇÕES DE CHECK-IN
// =============================================================

/**
 * Envia os dados do novo Check-in para o backend.
 * Corresponde ao endpoint: POST /api/checkins?groupId={UUID}&userId={ID}
 * @param {object} checkinData - Objeto contendo os dados do formulário de check-in.
 * @param {string} groupId - O UUID do grupo atual.
 * @returns {Promise<object>} O objeto Checkin retornado pela API.
 */
export async function createCheckin(checkinData, groupId) {
    const API_URL = `${API_URL_BASE}/checkins`;

    const checkinToSend = {
        tituloAtividade: checkinData.title,
        descricao: checkinData.description,
        metricas: {
            distanciaKm: checkinData.distance ? Number(checkinData.distance) : 0.0,
            duracaoMin: checkinData.duration ? Number(checkinData.duration) : 0,
            passos: checkinData.steps ? Number(checkinData.steps) : 0,
        },
    };

    try {
        const res = await fetch(`${API_URL}?groupId=${groupId}&userId=${CURRENT_USER_ID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(checkinToSend),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao criar Check-in: ${errorText}`);
        }

        return res.json();

    } catch (error) {
        console.error("Falha na rede ou servidor ao criar Check-in:", error);
        throw error;
    }
}

/**
 * Função para buscar Check-ins de um grupo específico.
 * Corresponde ao endpoint: GET /api/checkins?groupId={UUID}
 * @param {string} groupId O UUID do grupo para filtrar as atividades.
 * @returns {Promise<Array<object>>} Lista de check-ins.
 */
export async function getCheckinsByGroupId(groupId) {
    const API_URL = `${API_URL_BASE}/checkins`;

    try {
        const res = await fetch(`${API_URL}?groupId=${groupId}`);

        if (!res.ok) {
            console.error(`Erro ${res.status} ao buscar checkins.`);
            return [];
        }

        return res.json();

    } catch (error) {
        console.error("Falha na rede ao buscar checkins:", error);
        return [];
    }
}

// =============================================================
// FUNÇÕES DE GRUPO
// =============================================================

/**
 * Envia os dados do novo Grupo para o backend.
 * Corresponde ao endpoint: POST /api/groups?ownerId={ID}
 */
export async function createGroup(groupData, ownerId) {
    const API_URL = `${API_URL_BASE}/groups`;

    const res = await fetch(`${API_URL}?ownerId=${ownerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao cadastrar grupo: ${res.status} - ${errorText}`);
    }

    return res.json();
}

/**
 * Pega a lista de todos os grupos.
 * Corresponde ao endpoint: GET /api/groups
 */
export async function getAllGroups() {
    const API_URL = `${API_URL_BASE}/groups`;
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

// =============================================================
// FUNÇÕES DE COMENTÁRIO
// =============================================================

/**
 * Cria um novo comentário ou reação para um Check-in.
 * Corresponde ao endpoint: POST /api/comments?checkinId={ID}&userId={ID}
 * @param {number} checkinId O ID do Check-in sendo comentado.
 * @param {string} content O texto do comentário.
 * @param {string} reactionEmoji O emoji de reação (opcional).
 * @returns {Promise<object>} O objeto Comment criado.
 */
export async function createComment(checkinId, content, reactionEmoji = null) {
    const API_URL = `${API_URL_BASE}/comments`;

    const commentDataToSend = {
        content: content,
        reactionEmoji: reactionEmoji,
    };

    try {
        // Envia checkinId e userId na URL
        const res = await fetch(`${API_URL}?checkinId=${checkinId}&userId=${CURRENT_USER_ID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentDataToSend),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao enviar comentário: ${errorText}`);
        }

        return res.json();

    } catch (error) {
        console.error("Falha na rede ao enviar comentário:", error);
        throw error;
    }
}
// Adicione esta função ao final do seu groupService.js
// --------------------------------------------------------------------------
export async function getCommentsByCheckinId(checkinId) {
    // ⚠️ Certifique-se de que a API_URL_BASE está definida no topo do arquivo
    const API_URL_BASE = "http://localhost:8080/api";
    const API_URL = `${API_URL_BASE}/comments`;

    try {
        // GET /api/comments?checkinId={id} para buscar todos os comentários
        const res = await fetch(`${API_URL}?checkinId=${checkinId}`);

        if (!res.ok) {
            console.error(`Erro ${res.status} ao buscar comentários.`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Falha na rede ao buscar comentários:", error);
        return [];
    }
}
// --------------------------------------------------------------------------