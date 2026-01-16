<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Ambiente ('+ dados.id +')'  : 'Cadastrar Ambiente'}}
    </v-card-title>
      <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
    <v-card-text>
      <div :class="!isMobile() ? 'd-flex justify-center gap-3 align-center items-center' : 'gap-3'">
        <v-text-field label="Descrição" variant="outlined" v-model="dados.descricao" />
        <v-text-field label="Linhas máximas" type="number" variant="outlined" v-model="dados.linha_max" />
        <v-text-field label="Colunas máximas" variant="outlined" type="number" v-model="dados.coluna_max" />
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
import {getStatusMesasAll} from "@/services/mesa/status-mesa.service.ts";
import {createAmbiente, getAmbienteAll, updateAmbiente} from "@/services/cadastro/ambiente/ambiente.service.ts";
import {createMesa, updateMesa} from "@/services/mesa/mesa.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import type {Ambiente} from "@/models/Registros/Ambiente.ts";
import {isMobile} from "@/services/system/system.service.ts";
const dados = ref<Ambiente>({});
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Ambiente;
}>()
onMounted(() => {
  if(props.dados?.id){
  dados.value = props.dados;
  }
})
async function saveTable(){
  try{
    await createAmbiente(dados.value)
    snackbar.trigger("Ambiente criado com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar ambiente, tente novamente mais tarde", "error")
  }
}
async function editTable(){
  try{
    await updateAmbiente(dados.value.id!, dados.value)
    snackbar.trigger("Ambiente atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar ambiente, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>