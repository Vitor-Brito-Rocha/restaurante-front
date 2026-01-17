import api from "@/api-axios.ts";
import type {Produto} from "@/models/Registros/Produto.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "produto";

/**
 * Lista paginada
 */
export const getProdutoAll = async (): Promise<{
    produtos: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getProdutoPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    produtos: any[],
    pagination: { atualPagina: number },
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}?page=${page}&limit=${limit}`);
    return response.data;
};

/**
 * Busca paginada
 */
export const searchProdutoPaginated = async (
    model?: { type: string, value: string },
    page: number = 1,
    limit: number = 10
): Promise<{
    mesas: any[],
    pagination: { atualPagina: number },
    count: number,
    message: string
}> => {
    const response = await api.get(
        `${baseUrl}/${resource}?page=${page}&limit=${limit}&${model?.type}=${model?.value}`
    );
    return response.data;
};

export async function createProduto(produto: Produto, imagemFile?: File) {
    const formData = new FormData();
    // Adiciona os campos do produto
    if (produto.nome) formData.append('nome', produto.nome);
    if (produto.descricao) formData.append('descricao', produto.descricao);
    if (produto.preco !== undefined) formData.append('preco', produto.preco.toString());
    if (produto.categoria_id) formData.append('categoria_id', produto.categoria_id.toString());

    // Converte booleanos para string
    formData.append('ativo', produto.ativo ? 'true' : 'false');

    // Adiciona a imagem se fornecida
    if (imagemFile) {
        formData.append('imagem', imagemFile);
    }

    const response = await api.post(`${baseUrl}/${resource}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

export async function updateProduto(
    id: number,
    produto: Produto,
    imagemFile?: File,
    removerImagem: boolean = false
) {
    const formData = new FormData();

    // Adiciona apenas os campos que existem
    if (produto.nome) formData.append('nome', produto.nome);
    if (produto.descricao) formData.append('descricao', produto.descricao);
    if (produto.preco !== undefined) formData.append('preco', produto.preco.toString());
    if (produto.categoria_id) formData.append('categoria_id', produto.categoria_id.toString());

    // Booleanos sempre são enviados
    if (produto.ativo !== undefined) {
        formData.append('ativo', produto.ativo ? 'true' : 'false');
    }
    // Adiciona nova imagem se fornecida
    if (imagemFile) {
        formData.append('imagem', imagemFile);
    }

    // Se o usuário removeu a imagem mas não adicionou nova, envia flag
    if (removerImagem && !imagemFile) {
        formData.append('remover_imagem', 'true');
    }

    const response = await api.patch(`${baseUrl}/${resource}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

/**
 * Deletar mesa
 */
export const deleteProduto = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
export const changeStatusProduto = async (id: number): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/toggle-status/${id}`);
    return response.data;
};
