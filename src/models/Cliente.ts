import type {Endereco} from "@/models/Endereco.ts";

export interface Cliente {
    nome: String,
    email?: String,
    telefone?: String,
    cpf?: String,
    endereco?: Endereco[]
}