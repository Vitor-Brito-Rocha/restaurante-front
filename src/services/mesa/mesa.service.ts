import api from "@/api-axios.ts";
import type { Mesa } from "@/models/Mesa.ts";
import { organizeFilters } from "@/services/system/system.service.ts";
import type { PadraoManyFilters } from "@/models/PadraoManyFilters.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "mesa";

/**
 * Lista paginada
 */
export const getMesasAll = async (): Promise<{
    mesas: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getMesasPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    mesas: any[],
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
export const searchMesasPaginated = async (model: PadraoManyFilters,
    page: number = 1,
    limit: number = 10): Promise<{
        mesas: any[],
        pagination: { atualPagina: number },
        count: number,
        message: string
    }> => {
    let params = organizeFilters(model)
    const response = await api.get(
        `${baseUrl}/${resource}?page=${page}&limit=${limit}${params}`
    );
    return response.data;
};

/**
 * Criar mesa
 */
export const createMesa = async (mesa: Mesa): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};
export const getAmbienteAll = async (): Promise<{
    ambientes: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}/ambiente`);
    return response.data;
};
export const getStatusMesasAll = async (): Promise<{
    statusMesas: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}/status-mesa`);
    return response.data;
};
/**
 * Atualizar mesa
 */
export const updateMesa = async (id: number, mesa: Mesa): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteMesa = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};

/**
 * Trocar mesas
 */
export const switchMesas = async (
    firstMesaId: number,
    firstNewLocal: [number, number],
    nextMesaId: number,
    nextNewLocal: [number, number]
) => {
    const response = await api.patch(
        `${baseUrl}/${resource}/trocar-mesas`,
        { firstMesaId, firstNewLocal, nextMesaId, nextNewLocal }
    );
    return response.data;
};

