const express = require('express');
const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Dados em memória para armazenar as obras de música clássica
let obras = [
    { id: 1, titulo: "Sinfonia No. 5", compositor: "Ludwig van Beethoven", ano_composicao: 1808, periodo: "Clássico/Romântico", duracao_minutos: 40 },
    { id: 2, titulo: "As Quatro Estações", compositor: "Antonio Vivaldi", ano_composicao: 1723, periodo: "Barroco", duracao_minutos: 45 },
    { id: 3, titulo: "O Quebra-Nozes", compositor: "Pyotr Ilyich Tchaikovsky", ano_composicao: 1892, periodo: "Romântico", duracao_minutos: 90 },
    { id: 4, titulo: "Requiem", compositor: "Wolfgang Amadeus Mozart", ano_composicao: 1791, periodo: "Clássico", duracao_minutos: 60 },
    { id: 5, titulo: "Clair de Lune", compositor: "Claude Debussy", ano_composicao: 1905, periodo: "Impressionista", duracao_minutos: 5 }
];

let proximoId = 6; // Para gerar IDs únicos para novas obras

// Rota principal para testar se a API está rodando
app.get('/', (req, res) => {
    res.json({ mensagem: "Bem-vindo à API de Música Clássica!" });
});

// Iniciar o servidor na porta 3000
const PORT = 5500;
app.listen(PORT, () => console.log(`🚀 API de Música Clássica rodando na porta ${PORT}`));

// Função para validar dados da obra
function validarObra(dados ) {
    const erros = [];

    if (!dados.titulo || typeof dados.titulo !== 'string' || dados.titulo.trim().length < 2) {
        erros.push("O título da obra é obrigatório e deve ter pelo menos 2 caracteres.");
    }

    if (!dados.compositor || typeof dados.compositor !== 'string' || dados.compositor.trim().length < 2) {
        erros.push("O compositor é obrigatório e deve ter pelo menos 2 caracteres.");
    }

    if (!dados.ano_composicao || typeof dados.ano_composicao !== 'number' || dados.ano_composicao < 0 || dados.ano_composicao > 2026) {
        erros.push("O ano de composição deve ser um número válido entre 0 e 2026.");
    }

    if (!dados.periodo || typeof dados.periodo !== 'string' || dados.periodo.trim().length === 0) {
        erros.push("O período musical é obrigatório (ex: Barroco, Clássico, Romântico).");
    }

    if (!dados.duracao_minutos || typeof dados.duracao_minutos !== 'number' || dados.duracao_minutos <= 0) {
        erros.push("A duração em minutos é obrigatória e deve ser um número positivo.");
    }

    return erros;
}

// GET /api/musicas - Listar com filtros, ordenação e paginação
app.get('/api/musicas', (req, res) => {
    const { periodo, ano_min, ano_max, ordem, direcao, pagina = 1, limite = 10 } = req.query;

    let resultado = obras; // Começa com todas as obras

    // 1. Filtros
    if (periodo) {
        resultado = resultado.filter(o => o.periodo.toLowerCase() === periodo.toLowerCase());
    }
    if (ano_max) {
        resultado = resultado.filter(o => o.ano_composicao <= parseInt(ano_max));
    }
    if (ano_min) {
        resultado = resultado.filter(o => o.ano_composicao >= parseInt(ano_min));
    }

    // 2. Ordenação
    if (ordem) {
        resultado = resultado.sort((a, b) => {
            const direcaoMultiplicador = direcao === 'desc' ? -1 : 1;

            if (ordem === 'ano_composicao' || ordem === 'duracao_minutos') {
                return (a[ordem] - b[ordem]) * direcaoMultiplicador;
            }
            if (ordem === 'titulo' || ordem === 'compositor' || ordem === 'periodo') {
                return a[ordem].localeCompare(b[ordem]) * direcaoMultiplicador;
            }
            return 0; // Caso a ordem não seja reconhecida
        });
    }

    // 3. Paginação
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginado = resultado.slice(inicio, inicio + limiteNum);

    // Retorna os dados paginados e informações de paginação
    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

// GET /api/musicas/:id - Buscar por ID
app.get('/api/musicas/:id', (req, res) => {
    // Converte o ID da URL para número inteiro
    const id = parseInt(req.params.id);
    const obra = obras.find(o => o.id === id);

    // Se a obra não for encontrada, retorna 404
    if (!obra) {
        return res.status(404).json({ erro: "Obra musical não encontrada" });
    }
    // Caso contrário, retorna a obra
    res.json(obra);
});

// POST /api/musicas - Criar nova obra
app.post('/api/musicas', (req, res) => {
    const dados = req.body; // Os dados são automaticamente parseados pelo express.json()

    // Verifica se o corpo da requisição está vazio
    if (!dados) {
        return res.status(400).json({ erro: "Corpo da requisição inválido" });
    }

    // Chama a função de validação
    const erros = validarObra(dados);
    if (erros.length > 0) {
        // Se houver erros, retorna status 400 (Bad Request) com a lista de erros
        return res.status(400).json({ erros });
    }

    // Se os dados forem válidos, cria a nova obra
    const novaObra = {
        id: proximoId,
        titulo: dados.titulo.trim(),
        compositor: dados.compositor.trim(),
        ano_composicao: dados.ano_composicao,
        periodo: dados.periodo.trim(),
        duracao_minutos: dados.duracao_minutos
    };

    // Adiciona à lista e incrementa o ID
    obras.push(novaObra);
    proximoId++;

    // Retorna a obra criada com status 201 (Created)
    res.status(201).json(novaObra);
});