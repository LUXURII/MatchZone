# MatchZone

**MatchZone: A plataforma competitiva para jogadores de eSports de verdade.**

---

## 🚀 Status do Projeto: v1.2.0 (Conteúdo Inicial Implementado)

A **MatchZone** é uma plataforma digital premium focada em futebol e eSports. Conectamos jogadores, times e organizadores em um ambiente competitivo, oferecendo rankings globais, histórico detalhado de partidas e perfis completos.

Esta versão (v1.2.0) marca a implementação do conteúdo visual completo no frontend, transformando o esqueleto inicial em uma plataforma utilizável e pronta para apresentação.

## ✨ Funcionalidades Principais (v1.2.0)

*   **Experiência Mobile-First:** Design responsivo e otimizado para celulares.
*   **Landing Page Profissional:** Nova página inicial com Hero Section e benefícios claros.
*   **Navegação SPA (Single Page Application):** Troca de abas instantânea (Home, Perfil, Rankings, Arena) sem recarregar a página.
*   **Dados Realistas (Mock Data):** Seções de Rankings e Torneios populadas com dados mock para simular um ambiente ativo.
*   **Autenticação JWT:** Sistema de login e proteção de rotas (Backend Node.js/Express).
*   **Conexão MongoDB:** Banco de dados NoSQL para persistência de dados.

## 🛠️ Stack Tecnológica

*   **Frontend:** HTML5, CSS3, JavaScript Puro (Mobile-First UI)
*   **Backend:** Node.js, Express
*   **Banco de Dados:** MongoDB (Mongoose ODM)
*   **Autenticação:** JWT (JSON Web Tokens), bcrypt
*   **Hospedagem:** Railway (CI/CD Automatizado)

## ⚙️ Instalação e Execução Local

Para rodar o MatchZone localmente, siga estes passos:

1.  **Clone o repositório:**
    ```bash
    git clone github.com
    cd MatchZone
    ```

2.  **Instale as dependências do Backend:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com suas credenciais do MongoDB e JWT Secret:
    ```
    MONGO_URI=sua_connection_string_do_mongodb
    JWT_SECRET=seu_segredo_super_seguro
    PORT=8080
    ```

4.  **Inicie o Servidor:**
    ```bash
    npm start
    ```

5.  **Acesse a Aplicação:**
    Abra seu navegador e visite: `http://localhost:8080`

## 📄 Licença

Este projeto está sob a licença ISC.

---
© 2025 MatchZone eSports Platform
