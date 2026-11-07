# Como contribuir

Obrigado por querer ajudar o **Community Health**! Este guia explica como configurar o ambiente, organizar branches, escrever commits e abrir Pull Requests.

## Sumário

- [Antes de começar](#antes-de-começar)
- [Fluxo de trabalho](#fluxo-de-trabalho)
- [Nomenclatura de branches](#nomenclatura-de-branches)
- [Padrão de commits](#padrão-de-commits)
- [Pull Requests](#pull-requests)
- [Padrões de código](#padrões-de-código)
- [Reportando bugs e sugerindo ideias](#reportando-bugs-e-sugerindo-ideias)

---

## Antes de começar

1. Leia o [README.md](README.md) e o [docs/ideia.md](docs/ideia.md) para entender o produto e as regras de negócio.
2. Configure o ambiente seguindo a seção **Começando** do README (front-end em Next.js e back-end em FastAPI).
3. Confira as issues abertas antes de iniciar algo novo, para evitar trabalho duplicado.

## Fluxo de trabalho

1. Faça um **fork** do repositório (ou, se for colaborador direto, clone-o).
2. Atualize a `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
3. Crie uma branch a partir da `main` (veja a [nomenclatura](#nomenclatura-de-branches)):
   ```bash
   git checkout -b feat/checkin-aprovacao
   ```
4. Faça commits pequenos e focados, seguindo o [padrão de commits](#padrão-de-commits).
5. Envie a branch e abra um Pull Request para a `main`:
   ```bash
   git push origin feat/checkin-aprovacao
   ```

Não faça commits diretamente na `main`.

## Nomenclatura de branches

Use o formato `tipo/nome-issue`:

| Exemplo | Uso |
|---|---|
| `feat/SP-032-tela-cadastro` | Nova funcionalidade |
| `fix/SP-032-tela-cadastro` | Correção de bug |
| `refactor/SP-032-tela-cadastro` | Refatoração |
| `docs/SP-032-tela-cadastro` | Documentação |

## Padrão de commits

O projeto segue o [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/). O formato é:

```
<tipo>(<escopo opcional>): <descrição curta no imperativo>

<corpo opcional explicando o porquê>

<rodapé opcional: BREAKING CHANGE, Closes #12>
```

### Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Mudança de código que não altera comportamento (nem corrige bug, nem adiciona funcionalidade) |
| `docs` | Mudanças apenas em documentação |
| `style` | Formatação, espaços, ponto e vírgula (sem mudança de lógica) |
| `test` | Criação ou ajuste de testes |
| `chore` | Tarefas de manutenção: dependências, configs, scripts |
| `perf` | Melhoria de desempenho |
| `build` | Mudanças no sistema de build ou em dependências externas |
| `ci` | Mudanças em pipelines de integração contínua |
| `revert` | Reversão de um commit anterior |

### Escopos sugeridos

Use o escopo para indicar a área afetada: `auth`, `perfil`, `grupo`, `checkin`, `ranking`, `feed`, `chat`, `chatbot`, `gamificacao`, `api`, `ui`, `db`.

### Regras

- Descrição com no máximo ~72 caracteres, sem ponto final, no imperativo ("adiciona", "corrige").
- Escreva em português, de forma consistente com o restante do projeto.
- Um commit deve fazer uma coisa só.
- Mudanças que quebram compatibilidade levam `!` após o tipo/escopo (`feat(api)!: ...`) ou `BREAKING CHANGE:` no rodapé.

### Exemplos

```
feat(checkin): adiciona aprovação do grupo com limite de 60%
fix(ranking): corrige contagem de ofensivas após virada do dia
refactor(grupo): extrai regras de pontuação para serviço próprio
docs: atualiza stack para Next.js e FastAPI
chore: atualiza dependências do front-end
test(checkin): cobre rejeição por falta de aprovação
feat(chatbot): cria prompt de montagem de plano de treino
```

## Pull Requests

- Use como título o mesmo padrão dos commits (ex.: `feat(grupo): cria desafios privados com senha`).
- Descreva **o que** mudou, **por que** mudou e **como testar**.
- Relacione a issue, quando houver (`Closes #12`).
- Inclua capturas de tela em mudanças de interface, de preferência em tamanho de celular, já que o projeto é mobile-first.
- Mantenha o PR pequeno e focado. PRs grandes devem ser divididos.
- Antes de abrir, confira o checklist:

  - [ ] A branch está atualizada com a `main`
  - [ ] O código roda localmente sem erros
  - [ ] Testes novos ou existentes passam
  - [ ] Lint e formatação foram aplicados
  - [ ] A documentação foi atualizada, se necessário
  - [ ] Nenhuma credencial ou arquivo `.env` foi versionado

## Padrões de código

### Front-end (Next.js / TypeScript)

- Pense primeiro no celular (mobile-first) e depois adapte para telas maiores.
- Componentes em `PascalCase`, variáveis e funções em `camelCase`.
- Evite `any`; tipe props e respostas da API.
- Rode o lint e a formatação antes de commitar.

### Back-end (FastAPI / Python)

- Siga a PEP 8 (`snake_case` para funções e variáveis, `PascalCase` para classes).
- Use type hints e modelos Pydantic para entrada e saída da API.
- Mantenha regras de negócio em serviços, não nas rotas.
- Escreva testes para regras de pontuação, ofensivas e aprovação de check-ins.

### Geral

- Nunca versione senhas, tokens ou arquivos `.env`. Forneça um `.env.example`.
- Não inclua `node_modules`, `.venv`, `target` ou outros artefatos de build.

## Reportando bugs e sugerindo ideias

Abra uma issue com:

- **Bug:** passos para reproduzir, comportamento esperado, comportamento atual e, se possível, capturas de tela e dispositivo/navegador.
- **Ideia:** qual problema ela resolve e como se encaixa na proposta do projeto (focada em esportes em geral, consistência e motivação).

Obrigado por contribuir! 💪
