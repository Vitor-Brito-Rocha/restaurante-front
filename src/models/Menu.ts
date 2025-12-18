export type CrudPermissoes = {
    listar: boolean
    criar: boolean
    editar: boolean
    excluir: boolean
}
export interface MenuItem {
    id: number
    icone: string | null
    titulo: string
    rota: string
    parent_id: number | null
    visivel: boolean

    createdAt: string
    updatedAt: string

    permissoes: CrudPermissoes
    children: MenuItem[]
}
