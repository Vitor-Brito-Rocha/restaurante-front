<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
      {{'Editar Status da Mesa ('+ dados.id +')'}}
    </v-card-title>
    <v-form @submit.prevent="editTable()">
      <v-card-text v-if="isMobile()">
        <v-autocomplete label="Status" v-model="dados.status_id" item-value="id" item-title="descricao" :items="statusMesaList" variant="outlined" />
      </v-card-text>
      <v-card-text v-else>
        <div class="d-flex justify-center gap-3 align-center items-center">
          <v-autocomplete label="Status" v-model="dados.status_id" item-value="id" item-title="descricao" :items="statusMesaList" variant="outlined" />
        </div>
      </v-card-text>
      <v-card-actions class="justify-space-around">
        <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
        <v-btn color="success" type="submit" prepend-icon="mdi-check">Editar</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import type {Mesa} from "@/models/Mesa.ts";
import {getStatusMesasAll} from "@/services/mesa/status-mesa.service.ts";
import {getAmbienteAll} from "@/services/cadastro/ambiente/ambiente.service.ts";
import {createMesa, updateMesa} from "@/services/mesa/mesa.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {isMobile} from "@/services/system/system.service.ts";
const dados = ref<Mesa>({});
const statusMesaList = ref<any[]>([])
const snackbar = useSnackbarStore()
const emit = defineEmits(['close', 'update'])
const props = defineProps<{
  dados?: Mesa;
}>()
onBeforeMount(async () => {
    await getStatus()
  if(props.dados?.id){
    dados.value = props.dados;
  } else{
    emit('close')
  }
})
async function getStatus() {
  const status = await getStatusMesasAll()
  statusMesaList.value = status?.statusMesas ?? []
}
async function editTable(){
  try{
    await updateMesa(dados.value.id!, {status_id: dados.value.status_id})
    snackbar.trigger("Status atualizado com sucesso!", "success")
    emit('update')
  } catch (error: any) {
    snackbar.trigger("Não foi possível editar status da mesa, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>