import api from "@/api-axios.ts";
import {getIdUsuario} from "@/services/auth/auth.service.ts";
const baseUrl = import.meta.env.VITE_BASE_URL
const resource = "mesa"
export const getMesas = async (): Promise<any[]> => {
    const response =  await api.get(`${baseUrl}/${resource}`)
    return response.data.mesas
}
export const createMesas = async (model: {capacidade: string, localizacao: string, status_id: string}): Promise<any[]> => {
    const response =  await api.post(`${baseUrl}/${resource}/create`, model)
    return response.data.mesas
}
export const createMesas = async (model: {capacidade?: string, localizacao?: string, status_id?: string}, id: number): Promise<any[]> => {
    const response =  await api.post(`${baseUrl}/${resource}/${id}`, model)
    return response.data.mesas
}