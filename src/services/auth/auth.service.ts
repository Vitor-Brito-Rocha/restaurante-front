import router from "@/router";
import api from "@/api-axios.ts";
const baseUrl = import.meta.env.VITE_BASE_URL

const resource = "auth"
export const register = async (usuario: {}) => {
    const response = await api.post(`${baseUrl}/${resource}/register`, usuario)
    setToken(response.data.usuario.token)
    setIdUsuario(response.data.usuario.id)
    setNomeUsuario(response.data.usuario.nome)
    return response.data
}
export const login = async (usuario: {}) => {
    const response =  await api.post(`${baseUrl}/${resource}/login`, usuario)
    setToken(response.data.usuario.token)
    setIdUsuario(response.data.usuario.id)
    setNomeUsuario(response.data.usuario.nome)
    return response.data
}

export const setToken = (token: string) => {
    localStorage.setItem("token", token)
}
export const getToken = () => {
    return localStorage.getItem("token")
}
export const setIdUsuario = (idUsuario: string) => {
    localStorage.setItem("idUsuario", idUsuario)
}
export const getIdUsuario = () => {
    return localStorage.getItem("idUsuario")
}
export const setNomeUsuario = (nome: string) => {
    localStorage.setItem("nomeUsuario", nome)
}
export const getNomeUsuario = () => {
    return localStorage.getItem("nomeUsuario") || "Usuário"
}
export const logout = () => {
    localStorage.clear()
    router.push('/login')
}