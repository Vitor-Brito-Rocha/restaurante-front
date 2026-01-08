<template>
  <div class="w-100 h-100">
    <div class="w-100 d-flex gap-4 align-top justify-end">
      <reload-create suf="a" tela="Mesa" @reload="resetFilters()" :permissoes="permissoes" @create="newClient" />
    </div>
    <div class="mt-2 d-flex justify-space-around mb-2 w-100">
          <search-select-filters class="w-75" :key="searchKey" @update="verifyGetFunction($event, {page, offset})" :data="filtersModel" />

      <v-btn v-tooltip="'Alternar visão'" v-if="filters?.some(k => k.type === 'ambiente_id')" icon="mdi-swap-vertical" @click="viewMatriz = !viewMatriz" />
    </div>
    <div class="h-75 w-100">
      <CommomTableList v-if="!viewMatriz" :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction(null,$event)" @deleteModal="deletarMesa($event)" @editModal="editViewModal" />
      <MatrizMesaComponent v-else :data="items" />
    </div>
    <v-dialog v-model="dialogComponent">
      <MesaComponent :dados="mesaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {deleteMesa, getMesasPaginated, searchMesasPaginated, getStatusMesasAll, getAmbienteAll} from "@/services/mesa/mesa.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import MesaComponent from "@/components/mesa/Mesa-Component.vue";
import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";
import SearchSelectFilters from "@/components/search/SearchSelectFilters.vue";
import type {FilterSelect} from "@/models/FilterSelect.ts";
import ReloadCreate from "@/components/templates/reload-create.vue";
import {getRoute, logout, verifyPermission} from "@/services/auth/auth.service.ts";
import MatrizMesaComponent from "@/components/mesa/Matriz-Mesa-Component.vue";
import type Permissao from "@/models/Permissao.ts";
import {verifyError} from "@/services/system/system.service.ts";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const viewMatriz = ref(false)
const totalItems = ref<number>(0)
const headers = [
  {title: 'Código - Número', key: 'id'},
  {title: 'Capacidade', key: 'capacidade'},
  {title: 'Status', key: 'status_descricao'},
  {title: 'Ambiente', key: 'ambiente_descricao'},
  {title: 'Última Atualização', key: 'updatedAt'},
  {title: 'Ações', key: 'actions'},
]
const permissoes = ref<Permissao>(verifyPermission(getRoute()))
onMounted(async ()=>{
  try {
    const [statusRes, ambienteRes] = await Promise.all([
      getStatusMesasAll(),
      getAmbienteAll(),
      getItemsList()
    ])

    filtersModel.value.find(f => f.key === "status_id")!.items =
        statusRes.statusMesas

    filtersModel.value.find(f => f.key === "ambiente_id")!.items =
        ambienteRes.ambientes
  } catch (e: any) {
    // snackbar.trigger("Erro ao carregar filtros", "error")
  }

})
const page = ref<number>(1)
const offset = ref<number>(10)
const mesaSelected = ref<any>({})
const filtersModel = ref<FilterSelect[]>([
  {
    label: "Status",
    value: null,
    key: "status_id",
    items: []
  },
  {
    label: "Ambiente",
    value: null,
    key: "ambiente_id",
    items: []
  }
])
const searchKey = ref<number>(1)
function resetFilters(){
  filters.value = null
  page.value = 1
  offset.value = 10
  searchKey.value++
  verifyGetFunction()
}
const filters = ref<PadraoManyFilters | null>(null)
function verifyGetFunction(filters_param?: PadraoManyFilters | null, pagination?: {page: number, offset: number}) {
  page.value = pagination?.page ?? page.value
  offset.value = pagination?.offset ?? offset.value
  filters.value = filters_param ?? filters.value
  if(filters.value !== null && filters.value.some(f => f.value !== null && f.value !== undefined && f.value !== '')){
    search(filters.value)
  }
  else{
    getItemsList()
  }
}
function editViewModal(item: any){
  mesaSelected.value = item
  dialogComponent.value = true
}
async function deletarMesa(id: number){
  try {
    await deleteMesa(id)
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
async function search(model: PadraoManyFilters): Promise<void> {
  filters.value = model
  loadingTable.value = true
  try {
    const {mesas, pagination, count, message} = await searchMesasPaginated(model, page.value, offset.value)
    items.value = mesas;
    totalItems.value = count;
    page.value = Number(pagination.atualPagina);
    snackbar.trigger(`${message}!`, "success")
  }
  catch (error: any) {
    snackbar.trigger(`${error.message}!`, "error")
  }
  finally {
    loadingTable.value = false
  }
}
async function getItemsList() {
  loadingTable.value = true

  try {
    const {mesas, message, count, pagination} = await getMesasPaginated(page.value, offset.value)
    items.value = mesas
    totalItems.value = count;
    page.value = Number(pagination.atualPagina);
    snackbar.trigger(`${message}!`, "success")
  } catch (error: any) {
    verifyError(error)
  } finally {
    loadingTable.value = false
  }
}
</script>

<style scoped>
</style>
