import api from "@/api-axios.ts";
import type {Produto} from "@/models/Registros/Produto.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "produto";

/**
 * Lista paginada
 */
export const getMenu = async (): Promise<{
    menu: any[],
    categorias: any[],
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}/menu`);
    return response.data;
};