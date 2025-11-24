// 🚩 Defina a URL da API no topo do arquivo
const API_URL_BASE = "http://localhost:8080/api";

// ⚠️ USER ID HARDCODED PARA TESTE
const CURRENT_USER_ID = 1;

// =============================================================
// FUNÇÕES DE CHECK-IN
// =============================================================

/**
 * Envia os dados do novo Check-in para o backend (POST /api/checkins).
 * Agora espera o photoUrl no checkinData se a foto foi enviada.
 */
export async function createCheckin(checkinData, groupId) {
    const API_URL = `${API_URL_BASE}/checkins`;

    const checkinToSend = {
        tituloAtividade: checkinData.title,
        descricao: checkinData.description,
        // Inclui a URL da foto, se presente (assumindo que o App.js a incluiu)
        photoUrl: checkinData.photoUrl || null,
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
            throw { status: res.status, message: errorText };
        }

        return res.json();

    } catch (error) {
        console.error("Falha na rede ou servidor ao criar Check-in:", error);
        throw error;
    }
}

/**
 * Função para buscar Check-ins de um grupo específico (GET /api/checkins).
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

/**
 * 🔑 FUNÇÃO FALTANTE: Faz o upload de um arquivo MultiPart para o Check-in.
 * Corresponde ao endpoint: POST /api/checkins/upload
 */
export async function uploadCheckinImage(file) {
    const API_URL = `${API_URL_BASE}/checkins/upload`;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao fazer upload do Check-in: ${errorText}`);
        }

        return res.text(); // Retorna a URL como String

    } catch (error) {
        console.error("Falha na rede ou servidor ao fazer upload do Check-in:", error);
        throw error;
    }
}

// =============================================================
// FUNÇÕES DE GRUPO (CRUD & RANKING)
// =============================================================

/**
 * Envia os dados do novo Grupo para o backend (POST /api/groups).
 */
export async function createGroup(groupData, ownerId) {
    const API_URL = `${API_URL_BASE}/groups`;

    // 🔑 AJUSTE: Removemos a Base64 string (se existir) do payload JSON.
    const { image, ...groupDataToSend } = groupData;

    const res = await fetch(`${API_URL}?ownerId=${ownerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupDataToSend), // Envia o payload limpo
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ao cadastrar grupo: ${res.status} - ${errorText}`);
    }

    return res.json();
}

/**
 * Pega a lista de todos os grupos (GET /api/groups).
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

/**
 * FUNÇÃO DE RANKING: Busca a lista de classificação (GET /api/groups/{groupId}/ranking).
 */
export async function getGroupRanking(groupId) {
    const API_URL = `${API_URL_BASE}/groups/${groupId}/ranking`;

    try {
        const res = await fetch(API_URL);

        if (!res.ok) {
            console.error(`Erro ${res.status} ao buscar o ranking.`);
            return [];
        }

        return res.json(); // Retorna List<RankingDto>

    } catch (error) {
        console.error("Falha na rede ao buscar ranking:", error);
        return [];
    }
}

/**
 * FUNÇÃO DE UPLOAD DE IMAGEM (PARA GRUPO)
 */
export async function uploadImage(file) {
    const API_URL = `${API_URL_BASE}/groups/upload`;

    const formData = new FormData();
    formData.append("file", file); // 'file' corresponde ao @RequestParam("file") do Java

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            body: formData, // Envia o arquivo MultiPart
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao fazer upload: ${errorText}`);
        }

        return res.text(); // O endpoint Java retorna a URL como String

    } catch (error) {
        console.error("Falha na rede ou servidor ao fazer upload:", error);
        throw error;
    }
}

/**
 * NOVO MÉTODO: Atualiza a URL da imagem de um grupo existente (PUT /api/groups/{groupId}).
 */
export async function updateGroupImageUrl(groupId, imageUrl) {
    const API_URL = `${API_URL_BASE}/groups/${groupId}`;

    // Apenas envia o campo imageUrl que deve ser atualizado.
    const dataToSend = { imageUrl: imageUrl };

    try {
        const res = await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao atualizar imagem do grupo: ${errorText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Falha na rede ao atualizar imagem do grupo:", error);
        throw error;
    }
}

// =============================================================
// FUNÇÕES DE COMENTÁRIO/REACTION
// =============================================================

/**
 * Cria um novo comentário ou reação para um Check-in (POST /api/comments).
 */
export async function createComment(checkinId, content, reactionEmoji = null) {
    const API_URL = `${API_URL_BASE}/comments`;

    const commentDataToSend = {
        content: content,
        reactionEmoji: reactionEmoji,
    };

    try {
        const res = await fetch(`${API_URL}?checkinId=${checkinId}&userId=${CURRENT_USER_ID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentDataToSend),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw { status: res.status, message: errorText };
        }

        return res.json();

    } catch (error) {
        console.error("Falha na rede ao enviar comentário/reação:", error);
        throw error;
    }
}

/**
 * FUNÇÃO DE REMOÇÃO: Remove uma reação específica (DELETE /api/comments).
 */
export async function removeReaction(checkinId, emoji) {
    const API_URL = `${API_URL_BASE}/comments`;

    try {
        const res = await fetch(`${API_URL}?checkinId=${checkinId}&userId=${CURRENT_USER_ID}&emoji=${emoji}`, {
            method: "DELETE",
        });

        if (res.status === 204) {
            return true;
        }

        const errorText = await res.text();
        throw new Error(`Erro ${res.status} ao remover reação: ${errorText}`);

    } catch (error) {
        console.error("Falha na rede ao remover reação:", error);
        throw error;
    }
}

/**
 * Busca comentários de um Check-in (GET /api/comments).
 */
export async function getCommentsByCheckinId(checkinId) {
    const API_URL = `${API_URL_BASE}/comments`;

    try {
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