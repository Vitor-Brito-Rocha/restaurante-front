<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
        {{dados?.id ? 'Editar Permissões do Perfil ('+ dados.descricao +')'  : ''}}
    </v-card-title>
    <v-card-text  class="overflow-y-hidden">
      <PermissoesTable  :data="permissoes" />
    </v-card-text>
    <v-card-actions class="justify-space-around">
      <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {ModuloProfile, Perfil} from "@/models/Perfil/Perfil.ts";
import {createPerfil, updatePerfil} from "@/services/perfil/perfil.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import PermissoesTable from "@/components/profile/Permissoes-Table.vue";
import {getPermissoesByPerfil} from "@/services/perfil/permissao-perfil.service.ts";
const dados = ref<Perfil>({});
const permissoes = ref<ModuloProfile[]>([])
const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Perfil;
}>()
onMounted(async () => {
  if(props.dados?.id){
  dados.value = props.dados;
  permissoes.value = await getPermissoesByPerfil(dados.value.id!).then(result => result.data)
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