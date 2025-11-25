const API_URL = "http://localhost:8080/api/comments";

/**
 * Busca comentários de um check-in.
 */
export async function getComments(checkinId) {
    const res = await fetch(`${API_URL}?checkinId=${checkinId}`);
    if (!res.ok) throw new Error("Erro ao carregar comentários.");
    return res.json();
}

/**
 * Cria um comentário de texto.
 */
export async function createComment(content, checkinId, userId) {
    const payload = { content: content };
    
    const res = await fetch(`${API_URL}?checkinId=${checkinId}&userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erro ao comentar.");
    return res.json();
}

/**
 * Adiciona uma reação (Emoji).
 */
export async function addReaction(emoji, checkinId, userId) {
    const payload = { reactionEmoji: emoji };

    const res = await fetch(`${API_URL}?checkinId=${checkinId}&userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        // Se der erro 409 ou 500, pode ser duplicado, tratamos no front
        throw new Error("Erro ao reagir.");
    }
    return res.json();
}

/**
 * Remove uma reação.
 */
export async function removeReaction(emoji, checkinId, userId) {
    const res = await fetch(`${API_URL}?checkinId=${checkinId}&userId=${userId}&emoji=${emoji}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao remover reação.");
    return true;
}