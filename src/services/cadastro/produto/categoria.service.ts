import api from "@/api-axios.ts";
import type {Categoria} from "@/models/Tipos/Categoria.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "categoria";

/**
 * Lista paginada
 */
export const getCategoriaAll = async (): Promise<{
    categorias: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getCategoriaPaginated = async (
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
export const searchCategoriaPaginated = async (
    model?: { type: string, value: string },
    page: number = 1,
    limit: number = 10
): Promise<{
    categorias: any[],
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
 * Criar categoria
 */
export const createCategoria = async (categoria: Categoria): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, categoria);
    return response.data;
};

/**
 * Atualizar categoria
 */
export const updateCategoria = async (id: number, categoria: Categoria): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, categoria);
    return response.data;
};

/**
 * Deletar categoria
 */
export const deleteCategoria = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
