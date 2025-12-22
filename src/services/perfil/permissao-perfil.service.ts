import api from "@/api-axios.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;
const resource = "permissao-perfil";
export const getPermissoesByPerfil = async (id: number): Promise<{
    data: any[],
    message: string
}> => {
    const response = await api.get(`${baseUrl}/${resource}/${id}`);
    return response.data;
};
