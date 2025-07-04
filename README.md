# Projeto de Autenticação com JWT em Node.js

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## 📝 Descrição

Esta é uma API simples, porém completa, construída com Node.js e Express, que demonstra o fluxo fundamental de autenticação usando **JSON Web Tokens (JWT)**. O projeto inclui rotas para login de usuário, acesso a recursos protegidos e um mecanismo de logout funcional através de uma blacklist em memória.

Este projeto foi desenvolvido como um estudo prático sobre segurança de APIs, cobrindo conceitos essenciais de criação, verificação e invalidação de tokens.

## ✨ Funcionalidades Principais

-   **Autenticação de Usuário:** Rota de login que valida credenciais e gera um token.
-   **Geração de JWT:** Criação de tokens seguros e com tempo de expiração.
-   **Middleware de Proteção:** Um middleware que verifica a validade do token em rotas protegidas.
-   **Mecanismo de Logout:** Invalidação de tokens através de uma blacklist, impedindo seu reuso.
-   **Segurança:** Uso de variáveis de ambiente (`.env`) para proteger o segredo do JWT.

## 🛠️ Tecnologias Utilizadas

-   **Node.js:** Ambiente de execução JavaScript no servidor.
-   **Express.js:** Framework para criação da API e gerenciamento de rotas.
-   **jsonwebtoken:** Biblioteca para criar e verificar tokens JWT.
-   **dotenv:** Módulo para carregar variáveis de ambiente a partir de um arquivo `.env`.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação localmente.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 14 ou superior)
-   [Git](https://git-scm.com/)
-   Um cliente de API como o [Postman](https://www.postman.com/) para testar os endpoints.

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/BernardoBorbaR/TOKEN-JWT.git
    ```

2.  Navegue até a pasta do projeto:
    ```bash
    cd TOKEN-JWT
    ```

3.  Instale as dependências:
    ```bash
    npm install
    ```

4.  **Crie o arquivo de variáveis de ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione a seguinte variável. Este é um passo crucial para a segurança da aplicação.

    ```
    JWT_SECRET=seu_segredo_super_secreto_e_longo_aqui
    ```

5.  Inicie o servidor:
    ```bash
    node index.js
    ```

O servidor estará rodando em `http://localhost:3000`.

## API Endpoints (Guia para Postman)

### 1. Autenticação - Login

Realiza a autenticação do usuário e retorna um token JWT válido por 5 minutos.

-   **Método:** `POST`
-   **URL:** `http://localhost:3000/login`
-   **Body:** `raw` > `JSON`

    ```json
    {
        "user": "Bernardo",
        "password": "123"
    }
    ```

-   **Resposta de Sucesso (200 OK):**
    ```json
    {
        "auth": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### 2. Acessar Rota Protegida

Acessa uma lista de clientes. Requer um token válido no cabeçalho da requisição.

-   **Método:** `GET`
-   **URL:** `http://localhost:3000/clientes`
-   **Headers:**
    -   Vá para a aba `Authorization`.
    -   Selecione o tipo `Bearer Token`.
    -   Cole o token obtido no login no campo "Token".

-   **Resposta de Sucesso (200 OK):**
    ```json
    [
        {
            "id": 1,
            "nome": "Bernardo"
        }
    ]
    ```
-   **Resposta de Falha (401 Unauthorized):** Ocorre se o token não for fornecido, for inválido ou expirado.

### 3. Logout

Invalida o token atual, adicionando-o a uma blacklist para que não possa ser reutilizado.

-   **Método:** `POST`
-   **URL:** `http://localhost:3000/logout`
-   **Headers:**
    -   Use o mesmo `Bearer Token` da rota protegida.

-   **Resposta de Sucesso (200 OK):**
    ```json
    {
        "message": "Logout realizado com sucesso."
    }
    ```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## 👨‍💻 Autor

Feito com ❤️ por **Bernardo Borba**.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/BernardoBorbaR)
