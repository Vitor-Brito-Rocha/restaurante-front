import api from "@/api-axios.ts";
import {getIdUsuario} from "@/services/auth/auth.service.ts";
const baseUrl = import.meta.env.VITE_BASE_URL
const resource = "routes-front"
const id_usuario = getIdUsuario()
export const getRotasMenu = async (): Promise<any[]> => {
    const response =  await api.get(`${baseUrl}/${resource}/front/${id_usuario}`)
    return response.data.menu
}