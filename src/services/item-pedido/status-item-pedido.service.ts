import api from "@/api-axios.ts";
import type {UnwrapRef} from "vue";
import type {Status} from "@/models/Status.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "status-item-pedido";

/**
 * Lista paginada
 */
export const getStatusItemPedidoAll = async (): Promise<{
    statusItensPedidos: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getStatusItemPedidoPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    statusItensPedidos: any[],
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
export const searchStatusItemPedidoPaginated = async (
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
export const createStatusItemPedido = async (mesa: Status): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};

/**
 * Atualizar mesa
 */
export const updateStatusItemPedido = async (id: number, mesa: any): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteStatusItemPedido = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
