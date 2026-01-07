import api from "@/api-axios.ts";
import type {Categoria} from "@/models/Tipos/Categoria.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "categoria";

export const getCategoriasAll = async (): Promise<{
    categorias: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getCategoriasPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    categorias: any[],
    pagination: { atualPagina: number },
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}?page=${page}&limit=${limit}`);
    return response.data;
};

export const createCategoria = async (mesa: Categoria): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};

export const updateCategoria = async (id: number, mesa: Categoria): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

export const deleteCategoria = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
