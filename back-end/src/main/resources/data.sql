INSERT INTO Users (
    id,
    name,
    email,
    password_hash,
    level,
    created_at
    -- photo_url e memberships (relacionamento) são opcionais aqui
) VALUES (
    1,
    'Davi de Souza (Owner Teste)',
    'davi.teste@communityhealth.com',
    'hashed_password_for_123',
    1,
    CURRENT_TIMESTAMP()
);

-- Você pode adicionar mais usuários se precisar testar diferentes cenários:
INSERT INTO Users (id, name, email, password_hash, level, created_at)
VALUES (2, 'Carlos Silva', 'carlos.silva@communityhealth.com', 'hashed_password_for_456', 5, CURRENT_TIMESTAMP());