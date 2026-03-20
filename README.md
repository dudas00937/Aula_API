# Aula_API
Atividade de API - API de Músicas Clássicas
Endpoints

A API possui os seguintes endpoints:

1. GET /api/musicas

•Descrição: Lista todas as obras de música clássica cadastradas, com suporte a filtros, ordenação e paginação.

•Método: GET

•URL: http://localhost:3000/api/musicas

•Parâmetros de Query (Opcionais ):

- periodo: Filtra obras por período musical (ex: Barroco, Clássico, Romântico, Impressionista).
- ano_min: Filtra obras com ano de composição igual ou superior ao valor especificado.
- ano_max: Filtra obras com ano de composição igual ou inferior ao valor especificado.
- ordem: Campo para ordenação (titulo, compositor, ano_composicao, duracao_minutos).
- direcao: Direção da ordenação (asc para ascendente, desc para descendente). Padrão é asc.
- pagina: Número da página a ser exibida (padrão: 1).
- limite: Quantidade de itens por página (padrão: 10).

•
Resposta (Sucesso - 200 OK)
Exemplo de Requisição no Postman:
{
    "dados": [
{
"id": 2,
"titulo": "As Quatro Estações",
"compositor": "Antonio Vivaldi",
"ano_composicao": 1723,
"periodo": "Barroco",
"duracao_minutos": 45
}
],
    "paginacao": {
        "pagina_atual": 1,
        "itens_por_pagina": 5,
        "total_itens": 1,
        "total_paginas": 1
    }
}


2. GET /api/musicas/:id

•Descrição: Obtém os detalhes de uma obra musical específica pelo seu ID.

•Método: GET

•URL: http://localhost:3000/api/musicas/{id} (substitua {id} pelo ID da obra )

•Resposta (Sucesso - 200 OK)

•Exemplo de Requisição no Postman:
{
    "id": 1,
    "titulo": "Sinfonia No. 5",
    "compositor": "Ludwig van Beethoven",
    "ano_composicao": 1808,
    "periodo": "Clássico/Romântico",
    "duracao_minutos": 40
}

3. POST /api/musicas

•Descrição: Adiciona uma nova obra musical à coleção.

•Método: POST

•URL: http://localhost:3000/api/musicas

•Body (JSON ):

{
    "titulo": "Sinfonia No. 9",
    "compositor": "Ludwig van Beethoven",
    "ano_composicao": 1824,
    "periodo": "Romântico",
    "duracao_minutos": 70
}

Validações Implementadas:

•titulo: Obrigatório, string, mínimo de 2 caracteres.

•compositor: Obrigatório, string, mínimo de 2 caracteres.

•ano_composicao: Obrigatório, inteiro, entre 0 e 2026.

•periodo: Obrigatório, string, não vazio.

•duracao_minutos: Obrigatório, número, positivo.

- O HTML foi feito pelo MANUS/IA



<img width="689" height="433" alt="Captura de Tela 2026-03-19 às 20 23 11" src="https://github.com/user-attachments/assets/1dc95737-8703-4145-b867-6df93a568e16" />

<img width="716" height="569" alt="Captura de Tela 2026-03-19 às 20 24 06" src="https://github.com/user-attachments/assets/e3c3f663-53fc-4a85-a611-961eb26f28cd" />




