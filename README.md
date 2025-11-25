# 📝 README - Community Health Project

Este guia fornecerá as instruções necessárias para configurar e executar o projeto **Community Health** (Front-end e Back-end) em sua máquina local.

---

## 🚀 Como usar

Guia básico para rodar o projeto no seu computador.

### Pré-requisitos

Para garantir que o projeto funcione corretamente, você precisará ter o seguinte instalado:

* **Node.js** (Versão **16** ou superior)
* **npm** ou **yarn** (para o Front-end)
* **Java Development Kit (JDK)** (Versão **21** para o Back-end)
* **IntelliJ IDEA** (IDE que facilita o uso do maven, obs: pode ser outra IDE)
* **Docker** e **Docker Compose** (Para rodar o Banco de Dados facilmente)

---

## 🛠️ Tecnologias Utilizadas

### Front-end

* **React**
* **Vite**
* **Tailwind CSS**
* **lucide-react** (Ícones)

### Back-end

* **Spring Boot** (Java)
* **Maven** (Gerenciamento de dependências)

---

## ⚙️ Passo a Passo (Front-end)

O Front-end está localizado na raiz do projeto.

### 1. Clonar o Repositório

```bash
git clone https://github.com/Pedraugust0/Sport.git
cd community-health
```

### 2. Instalar Dependências

Utilize `npm` ou `yarn` para instalar as dependências do React/Vite:

```bash
npm install
```

ou com `yarn`:

```bash
yarn install
```

### 3. Rodar o Projeto (Front-end)

Execute o comando de desenvolvimento para iniciar o servidor do Front-end:

```bash
npm run dev
```

ou com `yarn`:

```bash
yarn dev
```

### 4. Acessar no Navegador

Após executar o comando acima, o projeto estará disponível em:

```
http://localhost:5173
```

> **Nota:** Se a porta `5173` estiver em uso, o Vite automaticamente tentará outra porta (e.g., `5174`, `5175`).

---

## ⚙️ Passo a Passo (Back-end)

O Back-end (Spring Boot) está localizado no subdiretório `/back-end`.

### 1. Navegar para o Diretório do Back-end

Abra um novo terminal e navegue para o diretório correto:

```bash
cd back-end
```

### 2. Configurar e Iniciar o banco de dados com Docker Compose

O arquivo `docker-compose.yml` é responsável por rodar o banco de dados e outros serviços necessários.

#### Pré-requisito: Instalar Docker e Docker Compose

Se você ainda não possui o Docker instalado, siga os passos abaixo no seu terminal:

```bash
# 1. Atualizar a lista de pacotes
sudo apt update

# 2. Instalar o Docker
sudo apt install docker.io -y

# 3. Instalar o Docker Compose
sudo apt install docker-compose -y

# 4. Iniciar o serviço do Docker e habilitar para iniciar com o sistema
sudo systemctl start docker
sudo systemctl enable docker
```

#### Rodar o Banco de Dados

Com o Docker instalado e rodando, execute o comando abaixo dentro da pasta `back-end` para subir o banco de dados:

```bash
docker-compose up -d
```

### 3. Instalar Dependências (IntelliJ IDEA)

Com o projeto aberto no **IntelliJ IDEA**, é necessário baixar as dependências listadas no `pom.xml`:

1. Localize a aba **Maven** na barra lateral direita da IDE.
2. Clique no ícone de **"Reload All Maven Projects"** (o primeiro ícone no topo da janelinha do Maven, que parece um símbolo de reciclagem/setas girando).

3. Aguarde o término do download e a indexação na barra de progresso inferior.

> **Nota:** Se preferir fazer via terminal, basta rodar `mvn clean install` dentro da pasta `back-end`.

### 4. Rodar a Aplicação

Para iniciar o servidor Spring Boot através do IntelliJ:

1. Navegue até `src/main/java/community_health/com/communityHealth/CommunityHealthApplication.java`.
3. Rode a classe `CommunityHealthApplication.java` (main).

Verifique o console do IntelliJ (aba "Run" na parte inferior). O projeto estará online e pronto para uso quando aparecer a mensagem:

> `Started CommunityHealthApplication in ... seconds`
