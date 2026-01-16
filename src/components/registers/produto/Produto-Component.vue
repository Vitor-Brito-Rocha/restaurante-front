<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Produto ('+ dados.id +')'  : 'Cadastrar Produto'}}
    </v-card-title>
      <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
    <v-card-text>
      <div :class="!isMobile() ? 'd-flex justify-center gap-3 align-center items-center' : 'gap-3'">
        <v-text-field label="Nome" variant="outlined" v-model="dados.nome" />
        <v-text-field label="Descrição" variant="outlined" v-model="dados.descricao" />
        <v-text-field label="Preço" type="number" variant="outlined" v-model="dados.preco" />
        <v-autocomplete :items="categorias" item-value="id" item-title="descricao" label="Categoria" variant="outlined" v-model="dados.categoria_id" />
        <v-switch variant="outlined" v-model="dados.visibilidade_menu" label="Visível no Menu" />
        <v-switch variant="outlined" v-model="dados.disponivel" label="Disponível" />
        <v-file-input variant="outlined" prepend-icon="" prepend-inner-icon="mdi-camera" label="Imagem" v-if="!dados.imagem_url" v-model="imagemProduto"></v-file-input>
        <v-img v-else width="400" height="400" :lazy-src="dados.imagem_url"></v-img>
      </div>
    </v-card-text>
    <v-card-actions class="justify-space-around">
      <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
      <v-btn color="success" type="submit" prepend-icon="mdi-check">{{dados?.id ? 'Editar' : 'Salvar'}}</v-btn>
    </v-card-actions>
      </v-form>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {isMobile} from "@/services/system/system.service.ts";
import type {Produto} from "@/models/Registros/Produto.ts";
import {createProduto, updateProduto} from "@/services/cadastro/produto/produto.service.ts";
import {getCategoriaAll} from "@/services/cadastro/produto/categoria.service.ts";
const dados = ref<Produto>({});
const categorias = ref<any[]>([])
const imagemProduto = ref<File>()
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Produto;
}>()
onMounted(() => {
  if(props.dados?.id){
  dados.value = props.dados;
  }
  getData()
})
async function getData(){
  categorias.value = await getCategoriaAll().then(r=>r.categorias)
}
async function saveTable(){
  try{
    await createProduto(dados.value)
    snackbar.trigger("Produto criado com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar Produto, tente novamente mais tarde", "error")
  }
}
async function editTable(){
  try{
    await updateProduto(dados.value.id!, dados.value)
    snackbar.trigger("Produto atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar Produto, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>