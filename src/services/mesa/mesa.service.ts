import api from "@/api-axios.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "mesa";

/**
 * Lista paginada
 */
export const getMesasPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    mesas: any[],
    pagination: { atualPagina: number },
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}/?page=${page}&limit=${limit}`);
    return response.data;
};

/**
 * Busca paginada
 */
export const searchMesasPaginated = async (
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
        `${baseUrl}/${resource}/?page=${page}&limit=${limit}&${model?.type}=${model?.value}`
    );
    return response.data;
};

/**
 * Criar mesa
 */
export const createMesa = async (mesa: {
    status: number,
    localizacao: string
}): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}/create`, mesa);
    return response.data;
};

/**
 * Atualizar mesa
 */
export const updateMesa = async (id: number, mesa: any): Promise<any> => {
    const response = await api.put(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteMesa = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
