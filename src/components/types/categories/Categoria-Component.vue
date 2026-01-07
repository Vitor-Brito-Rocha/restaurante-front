<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Categoria ('+ dados.id +')'  : 'Cadastrar Categoria'}}
    </v-card-title>
      <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
    <v-card-text>
      <div class="d-flex justify-center gap-3 align-center items-center">
        <v-text-field label="Descrição" variant="outlined" v-model="dados.descricao" />
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
import {createCategoria, updateCategoria} from "@/services/tipo/categoria/categoria.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import type {Categoria} from "@/models/Tipos/Categoria.ts";
const dados = ref<Categoria>({});
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Categoria;
}>()
onMounted(() => {
  if(props.dados?.id){
  dados.value = props.dados;
  }
})
async function saveTable(){
  try{
    console.log(dados.value)
    await createCategoria(dados.value)
    snackbar.trigger("Categoria criada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar categoria, tente novamente mais tarde", "error")
  }
}
async function editTable(){
  try{
    await updateCategoria(dados.value.id!, dados.value)
    snackbar.trigger("Categoria atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar categoria, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>