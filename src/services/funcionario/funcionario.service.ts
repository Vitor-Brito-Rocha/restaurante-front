import api from "@/api-axios.ts";
import type {Funcionario} from "@/models/Funcionario.ts";
import {organizeFilters} from "@/services/system/system.service.ts";
import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "funcionario";

/**
 * Lista paginada
 */
export const getFuncionarioAll = async (): Promise<{
    funcionarios: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getFuncionarioPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    funcionarios: any[],
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
export const searchFuncionarioPaginated = async (model: PadraoManyFilters,
                                           page: number = 1,
                                           limit: number = 10): Promise<{
    funcionarios: any[],
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
export const createFuncionario = async (mesa: Funcionario): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};
export const updateFuncionario = async (id: number, mesa: Funcionario): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

/**
 * Deletar mesa
 */
export const deleteFuncionario = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
