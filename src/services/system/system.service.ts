import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";

export const organizeFilters =  (model?: PadraoManyFilters): string=> {
    if(!model) return ''
    let model_organized = ''
    for (let i = 0; i < model.length; i++) {
        if(model[i].value) model_organized += `&${model[i]?.type}=${model[i]?.value}`
    }
    return model_organized
}
export const isMobile = (): boolean => window.innerWidth <= 768