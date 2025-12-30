import router from "@/router";
import api from "@/api-axios.ts";
import type {MenuItem} from "@/models/Menu.ts";
const baseUrl = import.meta.env.VITE_BASE_URL

const resource = "auth"
export const register = async (usuario: {}) => {
    const response: {data: {usuario: {id: number, token: string, nome: string, tipo_perfil_id: number}, message: string,}} = await api.post(`${baseUrl}/${resource}/register`, usuario)
    await Promise.all([
        setIdUsuario(response.data.usuario.id),
        setToken(response.data.usuario.token),
        setNomeUsuario(response.data.usuario.nome)
    ]);
    return response.data
}
export const login = async (usuario: {}) => {
    const response: {data: {usuario: {id: number, token: string, nome: string, tipo_perfil_id: number}, message: string,}} =  await api.post(`${baseUrl}/${resource}/login`, usuario)
    await Promise.all([
        setIdUsuario(response.data.usuario.id),
        setToken(response.data.usuario.token),
        setNomeUsuario(response.data.usuario.nome)
    ]);
    return response.data
}

export const setToken = async (token: string) => {
    localStorage.setItem("token", token)
}
export const getToken = () => {
    return localStorage.getItem("token")
}
export const setIdUsuario = async (idUsuario: number) => {
    localStorage.setItem("idUsuario", String(idUsuario))
}
export const getIdUsuario = () => {
    return localStorage.getItem("idUsuario")
}
export const setNomeUsuario = async (nome: string) => {
    localStorage.setItem("nomeUsuario", nome)
}
export const getNomeUsuario = () => {
    return localStorage.getItem("nomeUsuario") || "Usuário"
}
export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('idUsuario')
    localStorage.removeItem('menu')
    localStorage.removeItem('perfil_id')
    localStorage.removeItem('nomeUsuario')
    router.push('/login')
}
export const verifyPermission = (rota: string): {edit: boolean, list: boolean, delete: boolean, create: boolean} => {
    const menu: MenuItem[] = JSON.parse(localStorage.getItem('menu') || '[]');
    // Função recursiva para buscar o módulo pela rota
    const findModuloByRota = (rota: string, items: MenuItem[]): MenuItem | null => {
        for (const item of items) {
            if (item.rota === rota) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                const found = findModuloByRota(rota, item.children);
                if (found) return found;
            }
        }
        return null;
    };

    const modulo = findModuloByRota(rota, menu);

    if (!modulo || !modulo.permissoes) {
        console.log('nao achou o modulo')
        return {
            'list': false,
            'create': false,
            'edit': false,
            'delete': false
        };
    }

    // Mapear a ação para a propriedade correspondente
    const permissionMap = {
        'list': modulo.permissoes.listar,
        'create': modulo.permissoes.criar,
        'edit': modulo.permissoes.editar,
        'delete': modulo.permissoes.excluir
    };

    return permissionMap || false;
};
export const getRoute = () =>{
    return window.location.pathname.split('/')[1]
}

