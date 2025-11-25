const API_URL_BASE = "http://localhost:8080/api/auth";

/**
 * Registra um novo usuário.
 * POST /api/auth/register
 * Espera: { name, idade, cidade, email, password }
 */
export async function registerUser(userData) {
    // Mapeando para os nomes exatos que o Java espera (UserRegisterDTO)
    const payload = {
        name: userData.nome,      // Front: nome -> Java: name
        idade: parseInt(userData.idade), // Garante que seja Integer
        cidade: userData.cidade,
        email: userData.email,
        password: userData.senha  // Front: senha -> Java: password
    };

    const res = await fetch(`${API_URL_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        // Tenta ler a mensagem de erro do backend (ex: "Email já cadastrado")
        const errorText = await res.text();
        let errorMessage = errorText;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorText;
        } catch (e) {
            // Se não for JSON, usa o texto puro
        }
        throw new Error(errorMessage);
    }

    return res.json();
}

/**
 * Faz o Login.
 * POST /api/auth/login
 */
export async function loginUser(email, password) {
    const details = new URLSearchParams();
    details.append('email', email);
    details.append('password', password);

    const res = await fetch(`${API_URL_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: details,
    });

    if (!res.ok) {

        let mensagem = await res.json()

        throw new Error(mensagem.error);
    }

    return res.json();
}

export async function logoutUser() {
    const res = await fetch(`${API_URL_BASE}/logout`, { method: "POST" });
    if (!res.ok) throw new Error("Falha ao fazer logout.");
    return res.json();
}

// Verifica sessão checando se consegue acessar a lista de usuários (ou um endpoint /me se existisse)
export async function checkAuthentication() {
    // Como não temos um endpoint /me no backend fornecido, testamos com um get simples
    // Se retornar 401 ou 403, o cookie de sessão não é válido.
    try {
        const res = await fetch("http://localhost:8080/api/users"); 
        return res.status === 200;
    } catch (error) {
        return false;
    }
}