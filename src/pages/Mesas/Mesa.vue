<template>
  <div class="w-100 h-100">
    <div class="w-100 d-flex align-top justify-end">
      <v-btn density="default" variant="elevated" @click="newClient">
        Nova Mesa
        <v-icon icon="mdi-plus"></v-icon>
      </v-btn>
    </div>
    <div class="mt-3 mb-3 w-100">
          <search-select-filters @update="verifyGetFunction($event, {page, offset})" :data="filtersModel" />
    </div>
    <div class="h-75 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction(null,$event)" @viewModal="openViewModal" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <MesaComponent :dados="mesaSelected" @close="dialogComponent = false" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMesasPaginated, searchMesasPaginated} from "@/services/mesa/mesa.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import MesaComponent from "@/components/registers/Mesa/Mesa-Component.vue";
import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";
import SearchSelectFilters from "@/components/search/SearchSelectFilters.vue";
import type {FilterSelect} from "@/models/FilterSelect.ts";
import {getStatusMesasAll} from "@/services/mesa/status-mesa.service.ts";
import {getAmbienteAll} from "@/services/ambiente/ambiente.service.ts";
import type {Filter} from "@/models/Filter.ts";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = [
  {title: 'Código - Número', key: 'id'},
  {title: 'Capacidade', key: 'capacidade'},
  {title: 'Status', key: 'status_descricao'},
  {title: 'Ambiente', key: 'ambiente_descricao'},
  {title: 'Última Atualização', key: 'updatedAt'},
  {title: 'Ações', key: 'actions'},
]
onMounted(async ()=>{
  try {
    const [statusRes, ambienteRes] = await Promise.all([
      getStatusMesasAll(),
      getAmbienteAll()
    ])

    filtersModel.value.find(f => f.key === "status_id")!.items =
        statusRes.statusMesas

    filtersModel.value.find(f => f.key === "ambiente_id")!.items =
        ambienteRes.ambientes
  } catch (e) {
    snackbar.trigger("Erro ao carregar filtros", "error")
  }
  await getItemsList()
})
const permissoes = {edit: true}
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
const filters = ref<PadraoManyFilters | null>(null)
function verifyGetFunction(filters: Filter[] | null, pagination: {page: number, offset: number}) {
  page.value = pagination.page
  offset.value = pagination.offset
  if(filters !== null && filters.some(f => f.value !== null && f.value !== undefined && f.value !== '')){
    search(filters)
  }
  else{
    getItemsList()
  }
}
function openViewModal(item: any){
  console.log(item)
}
function editViewModal(item: any){
  mesaSelected.value = item
  dialogComponent.value = true
}
function newClient(){
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
    items.value = mesas
    totalItems.value = count;
    page.value = Number(pagination.atualPagina);
    snackbar.trigger(`${message}!`, "success")
  } catch (error: any) {
    snackbar.trigger(`${error.message}!`, "error")

  } finally {
    loadingTable.value = false
  }
}
</script>

<style scoped>
</style>
