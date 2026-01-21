export interface Perfil {
    id?: number,
    descricao?: string,
    ativo?: boolean,
    alteravel?: boolean,
}
export type Acoes = {
        Listar: boolean,
        Criar: boolean,
        Editar: boolean,
        Excluir: boolean
    }
export type ModuloProfile = {
    "modulo_id": number,
    "modulo_titulo": string,
    "modulo_permitido": boolean,
    "acoes": Acoes
}