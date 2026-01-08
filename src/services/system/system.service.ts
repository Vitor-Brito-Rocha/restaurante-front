import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";

export const organizeFilters =  (model?: PadraoManyFilters): string=> {
    if(!model) return ''
    let model_organized = ''
    for (let i = 0; i < model.length; i++) {
        if(model[i].value) model_organized += `&${model[i]?.type}=${model[i]?.value}`
    }
    return model_organized
}
export const findAdressByCEP = async (cep: string) => await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(res => res.json())
export const isMobile = (): boolean => window.innerWidth <= 768
export const verifyError = (error: any) =>{
    if(error.code == 'ERR_NETWORK') return
    const mensagem = error?.message ? 'Erro de conexão, tente novamente mais tarde': error.message
    console.log(`${error?.error?.message ? error?.error?.message : mensagem}!`)
    useSnackbarStore().error(`${error?.error?.message ? error?.error?.message : mensagem}!`)
    return
}