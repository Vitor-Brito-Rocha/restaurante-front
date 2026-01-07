<template>
  <v-card>
    <v-card-title class="d-flex text-wrap justify-center align-center w-100">
        {{dados?.id ? 'Editar Permissões do Perfil ('+ dados.descricao +')'  : ''}}
    </v-card-title>
    <v-card-text class="overflow-y-scroll">
      <PermissoesTable @associate-endpoint="cadastrarAcaoAoModulo($event)" @associate-module="cadastrarModulo($event)" @disassociate-endpoint="removerAcaoAoModulo($event)" @disassociate-module="removerModulo($event)" :key="pKey" :data="permissoes" />
    </v-card-text>
    <v-card-actions class="justify-space-around">
      <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {ModuloProfile, Perfil} from "@/models/Tipos/Perfil/Perfil.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import PermissoesTable from "@/components/types/profile/Permissoes-Table.vue";
import {
  associateAction, associateModule,
  disassociateAction, disassociateModule,
  getPermissoesByPerfil
} from "@/services/tipo/perfil/permissao-perfil.service.ts";
const dados = ref<Perfil>({});
const permissoes = ref<ModuloProfile[]>([])
const snackbar = useSnackbarStore()
const pKey = ref<number>(0)
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
async function cadastrarAcaoAoModulo(body: {modulo_id: number, acao: string}){
  try{
  await associateAction({...body, perfil_id: dados.value.id!})
    snackbar.trigger("Sucesso ao cadastrar ação!", "success")
  } catch(error: any){
    console.log(error)
    snackbar.trigger("Erro ao cadastrar essa ação", 'error')
  } finally {
    permissoes.value = await getPermissoesByPerfil(dados.value.id!).then(result => result.data)
    pKey.value++
  }
}
async function removerAcaoAoModulo(body: {modulo_id: number, acao: string}){
  try{
  await disassociateAction({...body, perfil_id: dados.value.id!})
    snackbar.trigger("Sucesso ao remover ação!", "success")
  } catch(error: any){
    console.log(error)
    snackbar.trigger("Erro ao remover essa ação", 'error')
  } finally {
    permissoes.value = await getPermissoesByPerfil(dados.value.id!).then(result => result.data)
    pKey.value++
  }
}
async function cadastrarModulo(body: {modulo_id: number}){
  try{
  await associateModule({...body, perfil_id: dados.value.id!})
    snackbar.trigger("Sucesso ao cadastrar módulo!", "success")
  }  catch(error: any){
    console.log(error)
    snackbar.trigger("Erro ao remover esse módulo", 'error')
  } finally {
    permissoes.value = await getPermissoesByPerfil(dados.value.id!).then(result => result.data)
    pKey.value++
  }
}
async function removerModulo(body: {modulo_id: number}){
  try{
  await disassociateModule({...body, perfil_id: dados.value.id!})
    snackbar.trigger("Sucesso ao remover módulo!", "success")
  } catch(error: any){
    console.log(error)
    snackbar.trigger("Sucesso ao remover módulo!", "success")

  } finally {
    permissoes.value = await getPermissoesByPerfil(dados.value.id!).then(result => result.data)
    pKey.value++
  }

}
</script>
<style scoped>

</style>