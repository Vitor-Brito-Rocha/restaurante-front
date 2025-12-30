<template>
  <div class="w-100 h-100">
    <div class="w-100 d-flex gap-4 align-top justify-end">
      <reload-create suf="o" tela="Ambiente" :permissoes="permissoes" @reload="verifyGetFunction()" @create="newClient" />
    </div>
    <div class="h-75 mt-2 mb-2 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction($event)" @deleteModal="deletarAmbiente($event)" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <AmbienteComponent :dados="mesaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import ReloadCreate from "@/components/templates/reload-create.vue";
import AmbienteComponent from "@/components/registers/Ambiente/Ambiente-Component.vue";
import {deleteAmbiente, getAmbientePaginated} from "@/services/ambiente/ambiente.service.ts";
import {getPermissoesByPerfil} from "@/services/perfil/permissao-perfil.service.ts";
import {getRoute, logout, verifyPermission} from "@/services/auth/auth.service.ts";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = [
  {title: 'Código', key: 'id'},
  {title: 'Descrição', key: 'descricao'},
  {title: 'Ações', key: 'actions'},
]
const permissoes = ref<{edit?: boolean, list?: boolean, delete?: boolean, create?: boolean, customize?: boolean}>(verifyPermission(getRoute()))
onMounted(async ()=>{
  await getItemsList()
})
const page = ref<number>(1)
const offset = ref<number>(10)
const mesaSelected = ref<any>({})
function verifyGetFunction(pagination?: {page: number, offset: number}) {
  page.value = pagination?.page ?? page.value
  offset.value = pagination?.offset ?? offset.value
  getItemsList()
}
function editViewModal(item: any){
  mesaSelected.value = item
  dialogComponent.value = true
}
async function deletarAmbiente(id: number){
  try {
    await deleteAmbiente(id)
    snackbar.trigger("Sucesso ao excluir ambiente!", "success")
    verifyGetFunction()
  }catch (error: any){
    snackbar.trigger("Não foi possível excluir esse ambiente, tente novamente mais tarde!", "error")

  }
}
function newClient(){
  mesaSelected.value = {}
  dialogComponent.value = true
}
async function getItemsList() {
  loadingTable.value = true

  try {
    const {ambientes, message, count, pagination} = await getAmbientePaginated(page.value, offset.value)
    items.value = ambientes
    totalItems.value = count;
    page.value = Number(pagination.atualPagina);
    snackbar.trigger(`${message}!`, "success")
  } catch (error: any) {
    const mensagem = error.message == "Network Error" ? 'Erro de conexão, tente novamente mais tarde': error.message
    snackbar.trigger(`${mensagem}!`, "error")
  } finally {
    loadingTable.value = false
  }
}
</script>

<style scoped>
</style>
