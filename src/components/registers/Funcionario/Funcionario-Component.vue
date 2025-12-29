<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
      {{dados?.funcionario_id ? 'Editar Funcionário ('+ dados.funcionario_id +')'  : 'Cadastrar Funcionário'}}
    </v-card-title>
    <v-form @submit.prevent="dados?.funcionario_id ? editTable() : saveTable()">
      <v-card-text>
        <div class="d-flex justify-center gap-3 align-center items-center">
          <v-autocomplete label="Tipo de Pessoa" item-title="descricao" item-value="id" v-model="dados.tipo" :items="[{id: 1, descricao: 'Pessoa Física'}, {id: 2, descricao: 'Pessoa Jurídica'}]" />
          <v-text-field label="Email" variant="outlined" type="number" v-model="dados.email" />
          <v-text-field label="Senha" variant="outlined" type="number" v-model="dados.senha" />
          <v-text-field label="Telefone" variant="outlined" type="number" v-model="dados.telefone" />
        </div>
        <div v-if="dados.tipo === 1" class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="" variant="outlined" type="number" v-model="dados.funcionario_id" />
        </div>
        <div v-if="dados.tipo === 2" class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="" variant="outlined" type="number" v-model="dados.email" />
        </div>
      </v-card-text>
      <v-card-actions class="justify-space-around">
        <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
        <v-btn color="success" type="submit" prepend-icon="mdi-check">{{dados?.funcionario_id ? 'Editar' : 'Salvar'}}</v-btn>
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
  if(props.dados?.funcionario_id){
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
    await updateFuncionario(dados.value.funcionario_id!, dados.value)
    snackbar.trigger("Funcionário atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível criar funcionário, tente novamente mais tarde", "error")
  }
}
</script>
<style scoped>

</style>