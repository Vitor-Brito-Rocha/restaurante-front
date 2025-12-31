import type {Endereco} from "@/models/Endereco.ts";

export interface Funcionario {
    "id"?: number,
    "ativo"?: boolean,
    "createdAt"?: string,
    "usuario_id"?: number,
    "email"?: string,
    "tipo_perfil_id"?: number,
    "tipo_perfil_descricao"?: string,
    "usuario_ativo"?: boolean,
    "pessoa_id"?: number,
    "nome"?: string,
    "tipo"?: number,
    "documento"?: string,
    "telefone"?: string,
    "senha"?: string,
    "data_nascimento"?: string,
    "razao_social"?: string,
    fisica?: Fisica,
    juridica?: Juridica,
    endereco?: Endereco
}
export type Fisica = {
    "cpf"?: string,
    "data_nascimento"?: string
}
export type Juridica = {
    "cnpj"?: string,
    "razao_social"?: string
}
