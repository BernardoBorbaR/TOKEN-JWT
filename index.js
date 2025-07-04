// Importa o módulo HTTP nativo do Node.js, que permite criar um servidor web
const http = require('http');

// Importa o framework Express, que facilita a criação de APIs e rotas
const express = require('express');

// Importa o módulo jsonwebtoken, que permite criar e verificar tokens JWT
const jwt = require('jsonwebtoken');

// Cria uma aplicação Express
const app = express();

// Define uma "chave secreta" que será usada para assinar/verificar os tokens JWT
const SECRET = 'borbatman';

// Middleware que faz o Express entender JSON no corpo das requisições
app.use(express.json());

// Rota simples para testar se o servidor está funcionando
app.get('/', (req, res) => {
    res.json({ message: "Tudo ok por aqui!" });
});

// Lista que vai guardar tokens que foram "deslogados"
const blacklist = [];

// Função middleware que verifica se o token JWT é válido
function verifyJWT(req, res, next) {
    // Pega o token do cabeçalho da requisição
    const token = req.headers['x-access-token'];

    // Verifica se o token está na lista negra (ou seja, já foi deslogado)
    const index = blacklist.findIndex(item => item === token);
    if(index !== -1) return res.status(401).end(); // se tiver, bloqueia o acesso

    // Verifica se o token é válido e ainda não expirou
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).end(); // token inválido ou expirado

        // Se estiver tudo certo, salva o ID do usuário na requisição e segue
        req.userId = decoded.userId;
        next();
    });
}

// Rota protegida que só pode ser acessada com token válido
app.get('/clientes', verifyJWT, (req, res) => {
    console.log(req.nome + ' fez esta chamada!'); // Mostra no terminal quem fez a requisição
    res.json([{ id: 1, nome: 'Bernardo' }]); // Retorna um exemplo de cliente
});

// Rota de login, onde o usuário envia nome e senha
app.post('/login', (req, res) => {
    const { user, password } = req.body; // Pega os dados enviados no corpo da requisição

    // Verifica se usuário e senha estão corretos (simplesmente comparando strings fixas)
    if (user === 'Bernardo' && password === '123') {
        // Cria um token JWT com validade de 5 minutos (300 segundos)
        const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 });
        return res.json({ auth: true, token }); // Retorna o token para o cliente
    }

    // Se usuário ou senha estiverem errados, retorna erro
    return res.status(401).json({ auth: false, message: 'Usuário ou senha inválidos' });
});

// Rota para logout: o token usado é colocado na blacklist, assim ele não pode mais ser usado
app.post('/logout', function (req, res) {
    blacklist.push(req.headers['x-access-token']); // Adiciona o token na lista negra
    res.end(); // Finaliza a requisição
});

// Cria o servidor e faz ele escutar na porta 3000
const server = http.createServer(app);
server.listen(3000, () => {
    console.log("Servidor escutando na porta 3000...");
});
