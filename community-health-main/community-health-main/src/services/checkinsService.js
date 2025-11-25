const API_URL = "http://localhost:8080/api/checkins";

/**
 * 1. Faz o upload da foto (se houver).
 * 2. Cria o check-in vinculando ao Grupo e ao Usuário.
 */
export async function createCheckin(checkinData, groupId, userId) {
    let photoUrl = null;

    // Passo A: Upload da imagem (se o usuário selecionou uma)
    if (checkinData.photoFile) {
        const formData = new FormData();
        formData.append("file", checkinData.photoFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
            method: "POST",
            body: formData,
        });

        if (!uploadRes.ok) throw new Error("Erro ao fazer upload da foto.");
        photoUrl = await uploadRes.text(); // O backend retorna a URL como string
    }

    // Passo B: Criar o objeto JSON do Checkin
    const payload = {
        tituloAtividade: checkinData.title,
        descricao: checkinData.description,
        photoUrl: photoUrl,
        metricas: {
            distanciaKm: parseFloat(checkinData.distance) || 0,
            duracaoMin: parseInt(checkinData.duration) || 0,
            passos: parseInt(checkinData.steps) || 0
        }
    };

    // Passo C: Enviar para o Backend
    // URL: POST /api/checkins?groupId=1&userId=2
    const res = await fetch(`${API_URL}?groupId=${groupId}&userId=${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erro ao criar check-in.");
    }

    return res.json();
}

/**
 * Busca todos os check-ins de um grupo específico.
 */
export async function getCheckinsByGroup(groupId) {
    const res = await fetch(`${API_URL}?groupId=${groupId}`);
    if (!res.ok) throw new Error("Erro ao buscar check-ins.");
    return res.json();
}