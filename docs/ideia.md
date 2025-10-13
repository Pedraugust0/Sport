# Community Health

> Pontue pelo que **você faz**. Não pelo que **você mostra**.

> Menos **Força**. Mais **Frequência.**

## Conceito
    
> Sistema web para unir pessoas e para práticas de esportes.

### **O que é:**
  1. Uma plataforma web focada em criar comprometimento e consistência através de um diário de treino compartilhado. O sistema utiliza a interação social para motivar os usuários a registrarem suas atividades físicas, utiliza os grupos para engajamento e uma construção de hábitos saudáveis.

### **Como Funciona:**
  1. Cadastro e Criação de Perfil: Ao criar sua conta, o usuário informa sua localização e seus esportes de interesse. Isso serve para filtrar pessoas pelo gosto e pela região parecida na hora do sistema fazer a recomendação de grupo.

### **Criação do Desafio:** 
  1. O usuário cria um grupo, e define o desafio, na criação escolhe um nome (ex: "Operação Foco Total"), uma duração e a regra principal para o ranking (ex: pontuar por "dias ativos").
  2. Convite e Formação do Grupo: Para convite, existem dois tipos de grupos, os privados e os públicos. Nas salas públicas qualquer usuário pode entrar, já nas privadas é necessário um link de acesso e da senha da sala.
  3. Pontuação do grupo: Existem 3 tipos de pontuação na plataforma, a pontuação por check-in (onde o usuário registra sua atividade diária, sendo acumulado o número total de check-ins até o final do desafio), a pontuação por tempo total práticado (onde esse tempo é acumulado a partir do tempo informado no check-in) e a pontuação por concistência (que é baseado no sistema de ofensivas do duolingo, porém você pode perder sua pontuação caso deixe de treinar nos dias determinados, e perde sua pontuaçâo total caso passe o limite de faltas determinados). Caso você tenha uma ofensiva por 7 dias você ganha um bonus na pontuação como incentivo.

### **Como se contabiliza o Check-In:**
  1. Para registrar sua atividade, o usuário clica em "Fazer Check-in".
  2. O usuário informa qual atividade física ele praticou no dia.
  3. O usuário descreve a atividade praticada. Ex: "Fiz 45 minutos de musculação, foco em costas e bíceps", ou "Corrida leve de 5km na orla".
  4. O usuário opcionalmente informa uma foto comprovando a atividade praticada.
  5. Ao confirmar, o registro é publicado no feed do desafio.
      1. Os integrantes do grupo precisam avaliar o check-in publicado, precisando da aprovação de 60% dos integrantes do grupo para contabilizar, caso o contrário o check-in é descartado.
      2. É possível salvar o seu registro como uma foto para poder o compartilhar em outras redes sociais caso tenha sido aprovado, o registro é baixado como uma foto contendo opcionalmente as informações do registro, como tempo, calorias e afins…
      3. Acompanhamento e Interação: A página do desafio é o hub social do grupo, contendo:
          1. Ranking em tempo real: Classificação que mostra quem está mais consistente com os registros diários.
          2. Feed de Atividades: Um mural com os registros de todos. Em vez de uma galeria de fotos, é uma lista de descrições: "Ciclano fez o check-in: 'Treino de pernas hoje, foi pesado!'". Se uma foto foi anexada, ela aparece junto ao texto.
          3. Chat Integrado: Para conversas, combinações e apoio mútuo.
  6. Ao final do desafio, é feito a premiação com base no desempenho individual, calculado a partir das pontuações obtidas e é gerado um feedback final para o grupo com o desempenho de cada integrante.

## Funcionalidades

### **Funcionalidades Chave:**
  1. Sistema de Desafios em Grupo: Ferramenta para criar competições (colocar uma premiação para quem obtiver um melhor desempenho no grupo) privadas ou públicas, com regras e duração personalizáveis.
  2. Check-in por Texto: O registro da atividade é feito primariamente por uma descrição escrita, removendo a obrigatoriedade da foto.
  3. Upload Opcional de Fotos: Flexibilidade para quem deseja fortalecer seu registro com uma imagem.
  4. Aprovação do check-in pelo grupo, necessitando 60% de aprovação do grupo.
  5. Feed Focado em Descrições: O mural de atividades valoriza o compartilhamento da experiência do treino, não apenas a imagem.
  6. Compartilhamento de check-ins em outras redes sociais com as informações detalhadas nele.
  7. Ranking Automatizado por Consistência: O sistema recompensa a frequência de registros, reforçando o hábito.
  8. Perfis de Usuário para Conexão: Uso de dados de esportes e localização para fortalecer a comunidade.
  9. Acesso Web Universal: Funciona perfeitamente em qualquer navegador (computador ou celular), sem necessidade de apps.

### Diferencial
  1. Nosso diferencial é a criação de um espaço de c**ompromisso, livre de selfies vazias**. Valorizamos a **experiência real** descrita no seu check-in, tornando o registro rápido e inclusivo. No entanto, para garantir a consistência, ativamos o p**oder de veto do grupo**: o registro só pontua após a aprovação de 60% dos integrantes. O resultado é um **ambiente de apoio mútuo** focado na **transparência e na formação de hábitos**, e não na competição por cliques ou imagens.
        
## Especificações Técnicas
### Linguagem Front-End
  - Html
  - Css
  - Typescript
      - Angular
### Linguagem Back-End
  - Java
      - Spring-Boot
          - Web
          - JPA
          - Validations
          - Security
### DBMS
  - Relacional
      - PostgreSQL
  - Não Relacional
        - …
