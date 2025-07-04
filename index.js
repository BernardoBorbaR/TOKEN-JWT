// NOVO: Carrega as variáveis de ambiente do arquivo .env no início de tudo
require('dotenv').config();

const http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');

// ALTERADO: O segredo agora é lido de forma segura a partir das variáveis de ambiente
const SECRET = process.env.JWT_SECRET;

// Validação para garantir que o servidor não inicie sem o segredo
if (!SECRET) {
    console.error("ERRO: A variável de ambiente JWT_SECRET não foi definida. Crie um arquivo .env.");
    process.exit(1); // Encerra a aplicação se o segredo não estiver configurado
}

const app = express();

app.use(express.json());

// A blacklist continua em memória para este exemplo
const blacklist = [];

// Rota de teste inicial
app.get('/', (req, res) => {
    res.json({ message: "Tudo ok por aqui!" });
});

// --- Middleware de Verificação de Token (Refatorado) ---
function verifyJWT(req, res, next) {
    // ALTERADO: Lendo o token do cabeçalho 'Authorization' no padrão "Bearer"
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Nenhum token fornecido.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token mal formatado.' });
    }

    // Verifica se o token está na blacklist
    if (blacklist.includes(token)) {
        return res.status(401).json({ message: 'Token inválido (logout já realizado).' });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            // MELHORADO: Resposta de erro mais clara
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        req.userId = decoded.userId;
        next();
    });
}

// --- Rotas da Aplicação ---

// Rota de login (sem alterações na lógica principal)
app.post('/login', (req, res) => {
    const { user, password } = req.body;

    if (user === 'Bernardo' && password === '123') {
        const token = jwt.sign({ userId: 1 }, SECRET, { expiresIn: 300 }); // Token expira em 5 minutos
        return res.json({ auth: true, token });
    }

    return res.status(401).json({ auth: false, message: 'Usuário ou senha inválidos' });
});

// Rota protegida
app.get('/clientes', verifyJWT, (req, res) => {
    // CORRIGIDO: Usando a variável correta 'req.userId' que foi definida no middleware
    console.log(`Usuário com ID ${req.userId} fez esta chamada!`);
    res.json([{ id: 1, nome: 'Bernardo' }]);
});

// Rota de logout (Refatorada para usar o padrão Bearer)
app.post('/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            blacklist.push(token);
        }
    }
    
    // MELHORADO: Resposta de sucesso clara
    res.status(200).json({ message: 'Logout realizado com sucesso.' });
});


// --- Inicialização do Servidor ---
const server = http.createServer(app);
server.listen(3000, () => {
    console.log("Servidor escutando na porta 3000...");
});