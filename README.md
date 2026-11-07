# Community Health

> Pontue pelo que **você faz**. Não pelo que **você mostra**.
>
> Menos **força**. Mais **frequência**.

Plataforma web **mobile-first** para pessoas que querem praticar esportes, de qualquer modalidade (futebol, corrida, natação, vôlei, ciclismo, lutas, musculação e outros), e precisam de motivação para manter a rotina. Os usuários registram suas práticas esportivas, compartilham o progresso em grupos e são estimulados pela convivência, pela competição saudável e por desafios gamificados. Um **chatbot integrado** ajuda a montar planos de treino e tira dúvidas.

Projeto desenvolvido como **Projeto Integrador 2**.

---

## Sumário

- [Problema e proposta](#problema-e-proposta)
- [Funcionalidades](#funcionalidades)
- [Como funciona](#como-funciona)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Começando](#começando)
- [Como contribuir](#como-contribuir)
- [Documentação](#documentação)
- [Status](#status)
- [Autor](#autor)

---

## Problema e proposta

Muita gente começa a praticar um esporte e desiste nas primeiras semanas. A proposta do Community Health é criar **comprometimento e consistência** por meio de um **diário esportivo compartilhado**: cada registro vira parte de uma história coletiva, e a interação social ajuda a construir hábitos saudáveis.

O diferencial é um espaço de compromisso **sem selfies vazias**. O foco está na **experiência real** descrita no check-in. Para garantir a consistência, o grupo tem poder de veto: um registro só pontua após a aprovação de **60% dos integrantes**.

---

## Funcionalidades

- **Cadastro e perfil** com localização e esportes de interesse, usados para recomendar grupos parecidos com o perfil do usuário.
- **Desafios em grupo**, com nome, duração e regra de ranking definidos pelo criador (ex.: "dias ativos").
  - Grupos **públicos** (entrada livre) e **privados** (acesso por link e senha).
- **Check-in por texto**, com o esporte ou atividade praticada, descrição livre (ex.: "Joguei 1h de futebol society", "Corrida leve de 5 km na orla" ou "45 min de musculação") e foto opcional.
- **Aprovação pelo grupo**: o check-in só é contabilizado com 60% de aprovação dos integrantes.
- **Três tipos de pontuação**:
  - **Check-ins**: total de registros aprovados até o fim do desafio.
  - **Tempo praticado**: soma do tempo informado nos check-ins.
  - **Consistência**: sistema de ofensivas, com bônus ao atingir 7 dias seguidos e perda de pontos ao ultrapassar o limite de faltas.
- **Página do desafio** como hub social, com:
  - Ranking em tempo real;
  - Feed de atividades em formato de descrições (a foto, quando existe, aparece junto ao texto);
  - Chat integrado para combinações e apoio mútuo.
- **Compartilhamento de check-ins** como imagem, com informações como tempo e calorias, para redes sociais.
- **Premiação e feedback final** ao término do desafio, com base no desempenho individual.
- **Gamificação** para motivação contínua (em definição).
- **Chatbot customizado** para montar planos de treino e tirar dúvidas sobre esportes (em definição).

---

## Como funciona

1. O usuário cria uma conta e informa localização e esportes de interesse.
2. Entra em um grupo público ou privado, ou cria o seu próprio desafio.
3. Faz o check-in do dia descrevendo o que praticou e, opcionalmente, anexando uma foto.
4. O grupo avalia o check-in. Com 60% de aprovação, ele pontua.
5. Acompanha o ranking, o feed e conversa com o grupo.
6. Ao final do desafio, recebe a premiação e o feedback de desempenho.

---

## Arquitetura
- **Front-end** em **Next.js**, servido como camada de interface e renderização.
- **Back-end principal** em **FastAPI**, responsável pela API, autenticação, regras de desafios, pontuação e aprovação de check-ins.
- **Chatbot** integrado ao back-end, com prompts customizados para planos de treino e dúvidas sobre esportes em geral.

---

## Tecnologias

### Front-end
- **Next.js** (React)
- **TypeScript**
- **CSS** (estilização em definição)

### Back-end
- **FastAPI** (Python)
- **Pydantic** (validação) e **SQLAlchemy** (ORM)
- **Autenticação** com JWT
- **Banco de dados relacional**: PostgreSQL (planejado)

### Chatbot
- Integração com modelo de linguagem via API (provedor a definir)

> As escolhas acima refletem o estado atual do planejamento e podem mudar durante o desenvolvimento.

---

## Estrutura do repositório

```
.
├── back-end/      # API FastAPI (em desenvolvimento)
├── docs/          # Documentação do projeto
│   ├── ideia.md        # Conceito, funcionalidades e regras de negócio
│   └── diagrama_er.md  # Modelo entidade-relacionamento
└── README.md
```

---

## Começando

### Pré-requisitos

- **Node.js** 20+ e **npm** (ou **pnpm**/**yarn**) para o front-end
- **Python** 3.11+ para o back-end
- **Docker** e **Docker Compose** para o banco de dados (quando disponível)
- **Git**

### 1. Clonar o repositório

```bash
git clone https://github.com/Pedraugust0/Sport.git
cd Sport
```

### 2. Back-end (FastAPI)

```bash
cd back-end
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API ficará disponível em `http://localhost:8000`, e a documentação interativa em `http://localhost:8000/docs`.

### 3. Front-end (Next.js)

> A pasta do front-end ainda não foi criada neste repositório. Quando estiver disponível, o fluxo será:

```bash
cd front-end
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

### 4. Variáveis de ambiente

Crie os arquivos `.env` a partir dos modelos de exemplo, quando existirem. Nunca versione credenciais.

---

## Como contribuir

Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para ver o fluxo de branches, o padrão de commits e o checklist de Pull Requests.

---

## Documentação

- [Conceito e regras de negócio](docs/ideia.md)
- [Diagrama entidade-relacionamento](docs/diagrama_er.md)

---

## Status

🚧 **Em desenvolvimento.** Próximas etapas:

- [ ] Autenticação e perfil de usuário
- [ ] Criação e gerenciamento de desafios em grupo
- [ ] Check-in com aprovação do grupo
- [ ] Ranking, feed e chat do desafio
- [ ] Sistema de pontuação e ofensivas
- [ ] Gamificação
- [ ] Chatbot de planos e dúvidas
- [ ] Compartilhamento de check-ins como imagem

---

## Autor

**Pedro Augusto** ([@Pedraugust0](https://github.com/Pedraugust0))
Projeto Integrador 2
