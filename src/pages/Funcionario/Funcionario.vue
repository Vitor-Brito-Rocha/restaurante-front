<template>
  <div class="w-100 h-100 pr-4">
    <div class="w-100 d-flex gap-4 align-top justify-end">
      <reload-create suf="a" tela="Mesa" @reload="getItemsList()" :permissoes="permissoes" @create="newClient" />
    </div>
    <div class="mt-2 mb-2 w-100">
      <search-filter @update="verifyGetFunction($event, {page, offset})" :filters="filters" />
    </div>
    <div class="h-75 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction(null,$event)" @deleteModal="deletarMesa($event)" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <MesaComponent :dados="mesaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {deleteFuncionario, getFuncionarioPaginated} from "@/services/funcionario/funcionario.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import MesaComponent from "@/components/registers/Mesa/Mesa-Component.vue";
import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";
import ReloadCreate from "@/components/templates/reload-create.vue";
import {getRoute, verifyPermission} from "@/services/auth/auth.service.ts";
import SearchFilter from "@/components/search/SearchFilter.vue";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = [
  {title: 'Nome', key: 'nome'},
  {title: 'Email', key: 'email'},
  {title: 'Documento', key: 'documento'},
  {title: 'Perfil', key: 'tipo_perfil_descricao'},
  {title: 'Ativo', key: 'ativo'},
  {title: 'Ações', key: 'actions'},
]
const permissoes = ref<{edit?: boolean, list?: boolean, delete?: boolean, create?: boolean, customize?: boolean}>(verifyPermission(getRoute()))
onMounted(()=>{
  try {
      getItemsList()
  } catch (e: any) {
    // snackbar.trigger("Erro ao carregar filtros", "error")
  }

})
const page = ref<number>(1)
const offset = ref<number>(10)
const mesaSelected = ref<any>({})
const filters = ref<{id: number, descricao: string }[]>([])
function verifyGetFunction(filters_param?: PadraoManyFilters | null, pagination?: {page: number, offset: number}) {
  page.value = pagination?.page ?? page.value
  offset.value = pagination?.offset ?? offset.value
    getItemsList()
}
function editViewModal(item: any){
  mesaSelected.value = item
  dialogComponent.value = true
}
async function deletarMesa(id: number){
  try {
    await deleteFuncionario(id)
    snackbar.trigger("Sucesso ao excluir mesa!", "success")
    verifyGetFunction()
  }catch (error: any){
    snackbar.trigger("Não foi possível excluir essa mesa, tente novamente mais tarde!", "error")
  }
}
function newClient(){
  mesaSelected.value = {}
  dialogComponent.value = true
}
async function getItemsList() {
  loadingTable.value = true

  try {
    const {funcionarios, message, count, pagination} = await getFuncionarioPaginated(page.value, offset.value)
    items.value = funcionarios
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
