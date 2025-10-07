import api from "@/api-axios.ts";
const baseUrl = import.meta.env.VITE_BASE_URL
const resource = "cliente"
export const getClientsPaginated = async (): Promise<{clientes: any[], pagination: {
        atualPagina: number;
    }, count: number, message: string}> => {
    const response =  await api.get(`${baseUrl}/${resource}/?page=1&limit=10`)
    return response.data
}
export const searchClientsPaginated = async (model?: {type: string, value: string}): Promise<{clientes: any[], pagination: {
        atualPagina: number;
    }, count: number, message: string}> => {
    const response =  await api.get(`${baseUrl}/${resource}/?page=1&limit=10&${model?.type}=${model?.value}`)
    return response.data
}
export const createClient = async (client: {
                                       tipo: number,
                                       nome: string,
                                       telefone: string,
                                       email: string,
                                       fisica?: {
                                           cpf: string,
                                           data_nascimento: string
                                       },
                                        juridica?: {
                                           cnpj: string,
                                            razao_social: string,
                                        }

                                       enderecos: [
                                           {
                                               cep: string,
                                               logradouro: string,
                                               bairro: string,
                                               estado: string,
                                               cidade: string,
                                               pais: string,
                                               numero: number,
                                               complemento: string
                                           }
                                       ]
                                   }
): Promise<any> => {
    const response =  await api.post(`${baseUrl}/${resource}/create`, client)
    return response.data
}