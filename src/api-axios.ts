// api.ts
import axios from "axios";
import { getToken, logout } from "@/services/auth/auth.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: baseUrl,
});

// Interceptor para sempre anexar o token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `${token}`;
            config.headers["ngrok-skip-browser-warning"] = `69420`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.code == 'ERR_NETWORK' && !navigator.onLine){
            console.log("Navegador Offline, requisicao impossivel")
            useSnackbarStore().trigger('Erro de conexão, verifique sua internet', "error")
        }
        if (error.response?.status === 401) {
            logout(); // limpa storage e manda pro /login
        }
        return Promise.reject(error);
    }
);
export default api;
