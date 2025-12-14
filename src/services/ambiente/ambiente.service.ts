import api from "@/api-axios.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "ambiente";

/**
 * Lista paginada
 */
export const getAmbienteAll = async (): Promise<{
    ambientes: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getAmbientePaginated = async (
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
export const searchAmbientePaginated = async (
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
export const createStatusMesa = async (mesa: {
    descricao: string
}): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}/create`, mesa);
    return response.data;
};

/**
 * Atualizar mesa
 */
export const updateStatusMesa = async (id: number, mesa: any): Promise<any> => {
    const response = await api.put(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteStatusMesa = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
