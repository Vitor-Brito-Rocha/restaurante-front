<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
      {{dados?.id ? 'Editar Funcionário ('+ dados.id +')'  : 'Cadastrar Funcionário'}}
    </v-card-title>
    <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
      <v-card-text>
        <div class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="" variant="outlined" type="number" v-model="dados.capacidade" />
        </div>
        <div class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="" variant="outlined" type="number" v-model="dados.capacidade" />
        </div>
        <div class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="" variant="outlined" type="number" v-model="dados.capacidade" />
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
import type {Funcionario} from "@/models/Funcionario.ts";
import {createFuncionario, updateFuncionario} from "@/services/funcionario/funcionario.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
const dados = ref<Funcionario>({});
const statusFuncionarioList = ref<any[]>([])
const ambienteList = ref<any[]>([])
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Funcionario;
}>()
onMounted(() => {
  if(props.dados?.id){
    dados.value = props.dados;
  }
})
async function saveTable(){
  try{
    await createFuncionario(dados.value)
    snackbar.trigger("Funcionário criada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar funcionário, tente novamente mais tarde", "error")
  }
}
async function editTable(){
  try{
    await updateFuncionario(dados.value.id!, dados.value)
    snackbar.trigger("Funcionário atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar funcionário, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>