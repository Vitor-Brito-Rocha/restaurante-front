import type {Endereco} from "@/models/Endereco.ts";

export interface Cliente {
    id: number,
    nome: String,
    email?: String,
    telefone?: String,
    cpf?: String,
    endereco?: Endereco[]
}