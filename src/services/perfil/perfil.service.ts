import api from "@/api-axios.ts";
import type {Perfil} from "@/models/Tipos/Perfil/Perfil.ts";
import {organizeFilters} from "@/services/system/system.service.ts";
import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "tipo-perfil";

export const getPerfisAll = async (): Promise<{
    perfis: any[],
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}`);
    return response.data;
};
export const getPerfisPaginated = async (
    page: number = 1,
    limit: number = 10
): Promise<{
    perfis: any[],
    pagination: { atualPagina: number },
    count: number,
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}?page=${page}&limit=${limit}`);
    return response.data;
};

export const createPerfil = async (mesa: Perfil): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}`, mesa);
    return response.data;
};

export const updatePerfil = async (id: number, mesa: Perfil): Promise<any> => {
    const response = await api.patch(`${baseUrl}/${resource}/${id}`, mesa);
    return response.data;
};

export const deletePerfil = async (id: number): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
