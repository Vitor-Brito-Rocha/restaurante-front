import router from "@/router";
import api from "@/api-axios.ts";
const baseUrl = import.meta.env.VITE_BASE_URL

const resource = "auth"
export const register = async (usuario: {}) => {
    const response: {data: {usuario: {id: number, token: string, nome: string, tipo_perfil_id: number}, message: string,}} = await api.post(`${baseUrl}/${resource}/register`, usuario)
    await Promise.all([
        setIdUsuario(response.data.usuario.id),
        setIdPerfil(response.data.usuario.tipo_perfil_id),
        setToken(response.data.usuario.token),
        setNomeUsuario(response.data.usuario.nome)
    ]);
    return response.data
}
export const login = async (usuario: {}) => {
    const response: {data: {usuario: {id: number, token: string, nome: string, tipo_perfil_id: number}, message: string,}} =  await api.post(`${baseUrl}/${resource}/login`, usuario)
    await Promise.all([
        setIdUsuario(response.data.usuario.id),
        setIdPerfil(response.data.usuario.tipo_perfil_id),
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
export const setIdPerfil = async (perfil: number) => {
    localStorage.setItem("perfil_id", String(perfil))
}
export const getIdPerfil = () => {
    return localStorage.getItem("perfil_id")
}
export const setNomeUsuario = async (nome: string) => {
    localStorage.setItem("nomeUsuario", nome)
}
export const getNomeUsuario = () => {
    return localStorage.getItem("nomeUsuario") || "Usuário"
}
export const logout = () => {
    localStorage.clear()
    router.push('/login')
}