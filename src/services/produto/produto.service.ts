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

/**
 * Criar mesa
 */
export const createProduto = async (mesa: Produto): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};

/**
 * Atualizar mesa
 */
export const updateProduto = async (id: number, mesa: Produto): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteProduto = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
