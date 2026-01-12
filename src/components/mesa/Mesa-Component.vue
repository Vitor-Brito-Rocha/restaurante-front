<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Mesa ('+ dados.id +')'  : 'Cadastrar Mesa'}}
    </v-card-title>
      <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
        <v-card-text v-if="isMobile()">
          <v-text-field label="Capacidade" variant="outlined" type="number" v-model="dados.capacidade" />
          <v-text-field label="Posição - Linha" variant="outlined" type="number" v-model="dados.linha" />
          <v-text-field label="Posição - Coluna" variant="outlined" type="number" v-model="dados.coluna" />
          <v-autocomplete label="Status" v-model="dados.status_id" item-value="id" item-title="descricao" :items="statusMesaList" variant="outlined" />
          <v-autocomplete label="Ambiente" v-model="dados.ambiente_id" item-value="id" item-title="descricao" :items="ambienteList" variant="outlined" />
        </v-card-text>
    <v-card-text v-else>
      <div class="d-flex justify-center gap-3 align-center items-center">
        <v-text-field label="Capacidade" variant="outlined" type="number" v-model="dados.capacidade" />
        <v-text-field label="Posição - Linha" variant="outlined" type="number" v-model="dados.linha" />
        <v-text-field label="Posição - Coluna" variant="outlined" type="number" v-model="dados.coluna" />
        <v-autocomplete label="Status" v-model="dados.status_id" item-value="id" item-title="descricao" :items="statusMesaList" variant="outlined" />
        <v-autocomplete label="Ambiente" v-model="dados.ambiente_id" item-value="id" item-title="descricao" :items="ambienteList" variant="outlined" />
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
import type {Mesa} from "@/models/Mesa.ts";
import {getStatusMesasAll} from "@/services/mesa/status-mesa.service.ts";
import {getAmbienteAll} from "@/services/cadastro/ambiente/ambiente.service.ts";
import {createMesa, updateMesa} from "@/services/mesa/mesa.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {isMobile, verifyError} from "@/services/system/system.service.ts";
const dados = ref<Mesa>({});
const statusMesaList = ref<any[]>([])
const ambienteList = ref<any[]>([])
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Mesa;
}>()
onMounted(() => {
  getData()
  if(props.dados){
  dados.value = props.dados;
  }
})
async function getData(){
  const [status, ambiente] = await Promise.all([
    getStatusMesasAll(),
    getAmbienteAll()
  ])
  statusMesaList.value = status?.statusMesas ?? []
  ambienteList.value = ambiente?.ambientes ?? []
}
async function saveTable(){
  try{
    await createMesa(dados.value)
    snackbar.trigger("Mesa criada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    verifyError(error)
  }
}
async function editTable(){
  try{
    await updateMesa(dados.value.id!, dados.value)
    snackbar.trigger("Mesa atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    verifyError(error)
  }
}
</script>
<style scoped>

</style>