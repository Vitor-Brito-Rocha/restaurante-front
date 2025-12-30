import api from "@/api-axios.ts";
import {getIdUsuario} from "@/services/auth/auth.service.ts";
const baseUrl = import.meta.env.VITE_BASE_URL
const resource = "routes-front"
export const getRotasMenu = async (): Promise<any[]> => {
    const response =  await api.get(`${baseUrl}/${resource}/front`)
    return response.data.menu
}