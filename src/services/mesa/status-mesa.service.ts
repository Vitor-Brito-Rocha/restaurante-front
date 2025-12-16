import api from "@/api-axios.ts";
import type {UnwrapRef} from "vue";
import type {StatusMesa} from "@/models/StatusMesa.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "status-mesa";

/**
 * Lista paginada
 */
export const getStatusMesasAll = async (): Promise<{
    statusMesas: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getStatusMesasPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    statusMesas: any[],
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
export const searchStatusMesasPaginated = async (
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
export const createStatusMesa = async (mesa: StatusMesa): Promise<any> => {
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
