import api from "@/api-axios.ts";
import type {Perfil} from "@/models/Tipos/Perfil/Perfil.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "permissao-perfil";
export const getPermissoesByPerfil = async (id: number): Promise<{
    data: any[],
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
export const associateAction = async (body: { perfil_id: number, acao: string, modulo_id: number }): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}/associar-acao`, body);
    return response.data;
};
export const disassociateAction = async (body: { perfil_id: number, acao: string, modulo_id: number }): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/desassociar-acao`, {
        data: body
    });
    return response.data;
};
export const associateModule = async (body: { perfil_id: number, modulo_id: number }): Promise<any> => {
    const response = await api.post(`${baseUrl}/${resource}/associar-modulo`, body);
    return response.data;
};
export const disassociateModule = async (body: { perfil_id: number, modulo_id: number }): Promise<any> => {
    const response = await api.delete(`${baseUrl}/${resource}/desassociar-modulo`, {
        data: body
    });
    return response.data;
};