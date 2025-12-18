<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Perfil ('+ dados.descricao +')'  : 'Cadastrar Perfil'}}
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
import type {Perfil} from "@/models/Perfil.ts";
import {createPerfil, updatePerfil} from "@/services/perfil/perfil.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
const dados = ref<Perfil>({});
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Perfil;
}>()
onMounted(() => {
  if(props.dados?.id){
  dados.value = props.dados;
  }
})
async function saveTable(){
  try{
    await createPerfil(dados.value)
    snackbar.trigger("Perfil criada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar mesa, tente novamente mais tarde", "error")
  }
}
async function editTable(){
  try{
    await updatePerfil(dados.value.id!, dados.value)
    snackbar.trigger("Perfil atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    console.log(error)
    snackbar.trigger("Não foi possível editar mesa, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>