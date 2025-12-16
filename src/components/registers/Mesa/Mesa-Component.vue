<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Mesa ('+ dados.id +')'  : 'Cadastrar Mesa'}}
    </v-card-title>
      <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
    <v-card-text>
      <div class="d-flex justify-center gap-3 align-center items-center">
        <v-text-field label="Capacidade" variant="outlined" type="number" v-model="dados.capacidade" />
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
import {getAmbienteAll} from "@/services/ambiente/ambiente.service.ts";
import {createMesa, updateMesa} from "@/services/mesa/mesa.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {joinMesa, onItemPronto} from "@/services/system/socket.ts";
import {getIdUsuario} from "@/services/auth/auth.service.ts";
import {registerPush} from "@/services/system/register-push.ts";
const dados = ref<Mesa>({});
const statusMesaList = ref<any[]>([])
const ambienteList = ref<any[]>([])
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Mesa;
}>()
onMounted(() => {
  if(props.dados?.id){
  dados.value = props.dados;
  }
  getStatusMesasAll().then(a =>{statusMesaList.value = a.statusMesas})
  getAmbienteAll().then(a =>{ambienteList.value = a.ambientes})
})
async function saveTable(){
  try{
    await createMesa(dados.value)
    snackbar.trigger("Mesa criada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar mesa, tente novamente mais tarde", "error")
  }
}
async function editTable(){
  try{
    joinMesa(dados.value.id!, Number(getIdUsuario()))
    registerPush(dados.value.id!)
    await updateMesa(dados.value.id!, dados.value)
    snackbar.trigger("Mesa atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar mesa, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>