const express = require('express');
const app = express();

app.use(express.json());

let obras = [
    { id: 1, titulo: "Sinfonia No. 5", compositor: "Ludwig van Beethoven", ano_composicao: 1808, periodo: "Clássico/Romântico", duracao_minutos: 40 },
    { id: 2, titulo: "As Quatro Estações", compositor: "Antonio Vivaldi", ano_composicao: 1723, periodo: "Barroco", duracao_minutos: 45 },
    { id: 3, titulo: "O Quebra-Nozes", compositor: "Pyotr Ilyich Tchaikovsky", ano_composicao: 1892, periodo: "Romântico", duracao_minutos: 90 },
    { id: 4, titulo: "Requiem", compositor: "Wolfgang Amadeus Mozart", ano_composicao: 1791, periodo: "Clássico", duracao_minutos: 60 },
    { id: 5, titulo: "Clair de Lune", compositor: "Claude Debussy", ano_composicao: 1905, periodo: "Impressionista", duracao_minutos: 5 }
];

let proximoId = 6;

function validarObra(dados, parcial = false) {
    const erros = [];

    if (!parcial || dados.titulo !== undefined) {
        if (!dados.titulo || typeof dados.titulo !== 'string' || dados.titulo.trim().length < 2) {
            erros.push("O título da obra é obrigatório e deve ter pelo menos 2 caracteres.");
        }
    }

    if (!parcial || dados.compositor !== undefined) {
        if (!dados.compositor || typeof dados.compositor !== 'string' || dados.compositor.trim().length < 2) {
            erros.push("O compositor é obrigatório e deve ter pelo menos 2 caracteres.");
        }
    }

    if (!parcial || dados.ano_composicao !== undefined) {
        if (typeof dados.ano_composicao !== 'number' || dados.ano_composicao < 0 || dados.ano_composicao > new Date().getFullYear()) {
            erros.push(`O ano de composição deve ser um número válido entre 0 e ${new Date().getFullYear()}.`);
        }
    }

    if (!parcial || dados.periodo !== undefined) {
        if (!dados.periodo || typeof dados.periodo !== 'string' || dados.periodo.trim().length === 0) {
            erros.push("O período musical é obrigatório (ex: Barroco, Clássico, Romântico).");
        }
    }

    if (!parcial || dados.duracao_minutos !== undefined) {
        if (typeof dados.duracao_minutos !== 'number' || dados.duracao_minutos <= 0) {
            erros.push("A duração em minutos é obrigatória e deve ser um número positivo.");
        }
    }

    return erros;
}

app.get('/', (req, res) => {
    res.json({ mensagem: "Bem-vindo à API de Música Clássica!" });
});

app.get('/api/musicas', (req, res) => {
    try {
        const { periodo, ano_min, ano_max, ordem, direcao, pagina = 1, limite = 10 } = req.query;

        let resultado = [...obras];

        if (periodo) {
            resultado = resultado.filter(o => o.periodo.toLowerCase().includes(periodo.toLowerCase()));
        }
        if (ano_max) {
            resultado = resultado.filter(o => o.ano_composicao <= parseInt(ano_max));
        }
        if (ano_min) {
            resultado = resultado.filter(o => o.ano_composicao >= parseInt(ano_min));
        }

        if (ordem) {
            resultado = resultado.sort((a, b) => {
                const direcaoMultiplicador = direcao === 'desc' ? -1 : 1;
                if (typeof a[ordem] === 'number') {
                    return (a[ordem] - b[ordem]) * direcaoMultiplicador;
                }
                if (typeof a[ordem] === 'string') {
                    return a[ordem].localeCompare(b[ordem]) * direcaoMultiplicador;
                }
                return 0;
            });
        }

        const paginaNum = Math.max(1, parseInt(pagina));
        const limiteNum = Math.max(1, parseInt(limite));
        const inicio = (paginaNum - 1) * limiteNum;
        const paginado = resultado.slice(inicio, inicio + limiteNum);

        res.json({
            dados: paginado,
            paginacao: {
                pagina_atual: paginaNum,
                itens_por_pagina: limiteNum,
                total_itens: resultado.length,
                total_paginas: Math.ceil(resultado.length / limiteNum)
            }
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro interno ao processar a listagem." });
    }
});

app.get('/api/musicas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido. Deve ser um número." });
    }

    const obra = obras.find(o => o.id === id);
    if (!obra) {
        return res.status(404).json({ erro: "Obra musical não encontrada." });
    }

    res.json(obra);
});

app.post('/api/musicas', (req, res) => {
    const dados = req.body;

    if (!dados || Object.keys(dados).length === 0) {
        return res.status(400).json({ erro: "Corpo da requisição vazio ou inválido." });
    }

    const erros = validarObra(dados);
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const novaObra = {
        id: proximoId++,
        titulo: dados.titulo.trim(),
        compositor: dados.compositor.trim(),
        ano_composicao: dados.ano_composicao,
        periodo: dados.periodo.trim(),
        duracao_minutos: dados.duracao_minutos
    };

    obras.push(novaObra);
    res.status(201).json(novaObra);
});

app.put('/api/musicas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido. Deve ser um número." });
    }

    const index = obras.findIndex(o => o.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Obra musical não encontrada para atualização." });
    }

    const dados = req.body;
    if (!dados || Object.keys(dados).length === 0) {
        return res.status(400).json({ erro: "Corpo da requisição vazio ou inválido." });
    }

    const erros = validarObra(dados);
    if (erros.length > 0) {
        return res.status(400).json({ erros });
    }

    const obraAtualizada = {
        id: id,
        titulo: dados.titulo.trim(),
        compositor: dados.compositor.trim(),
        ano_composicao: dados.ano_composicao,
        periodo: dados.periodo.trim(),
        duracao_minutos: dados.duracao_minutos
    };

    obras[index] = obraAtualizada;
    res.json(obraAtualizada);
});

app.delete('/api/musicas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido. Deve ser um número." });
    }

    const index = obras.findIndex(o => o.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Obra musical não encontrada para exclusão." });
    }

    const obraRemovida = obras.splice(index, 1);
    res.json({ mensagem: "Obra removida com sucesso!", obra: obraRemovida[0] });
});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ erro: "Ocorreu um erro interno no servidor." });
});

const PORT = 5500;
app.listen(PORT, () => console.log(`API de Música Clássica rodando na porta ${PORT}`));
