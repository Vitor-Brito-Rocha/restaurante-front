
export interface Produto {
    id?: number,
    descricao?: string,
    nome?: string,
    imagem_url?: string | null,
    preco?: number,
    categoria_id?: number,
    ativo?: boolean,
    ordem?: number,
}