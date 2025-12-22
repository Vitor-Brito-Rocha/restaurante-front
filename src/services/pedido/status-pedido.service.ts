import api from "@/api-axios.ts";
import type {UnwrapRef} from "vue";
import type {Status} from "@/models/Status.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "status-pedido";

/**
 * Lista paginada
 */
export const getStatusPedidoAll = async (): Promise<{
    statusPedidos: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getStatusPedidoPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    statusPedidos: any[],
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
export const searchStatusPedidoPaginated = async (
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
export const createStatusPedido = async (mesa: Status): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};

/**
 * Atualizar mesa
 */
export const updateStatusPedido = async (id: number, mesa: any): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteStatusPedido = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
