<template>
  <div class="w-100 h-100">
  <div class="w-100 h-5 d-flex align-top justify-end">
    <v-btn density="default" variant="elevated" @click="newClient">
      Novo Cliente
      <v-icon icon="mdi-plus"></v-icon>
    </v-btn>
  </div>
  <div class="h-10 mt-3 mb-3 w-100">
    <SearchFilter @search-event="search($event)" @reload-table="verifyGetFunction" :filters="filters"></SearchFilter>
  </div>
  <div class="h-75 w-100">
    <v-progress-linear indeterminate v-if="loadingTable"></v-progress-linear>
<!--    <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :total-items="totalItems" :page="page" @verify="verifyGetFunction" @viewModal="openViewModal" @editModal="editViewModal" />-->
  </div>
  <v-dialog v-model="dialogComponent">
    <ClienteComponent :dados="clienteSelected" @close="dialogComponent = false" />
  </v-dialog>
  </div>
</template>
<script setup lang="ts">
import SearchFilter from "@/components/search/SearchFilter.vue";
import {onMounted, ref} from "vue";
import {getClientsPaginated, searchClientsPaginated} from "@/services/client/client.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import ClienteComponent from "@/components/registers/clientes/Cliente-Component.vue";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import type {Filter} from "@/models/Filter.ts";
import {verifyError} from "@/services/system/system.service.ts";
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = [
  {title: "Nome", key: "nome"},
    {title: "Email", key: "email"},
  {title: "Documento Principal", key: "documento_principal"},
    {title: "Cidade", key: "cidade"},
  {title: "Data Última Visita", key: "data_ultima_visita"},
  {title: "Idade", key: "idade"},
  {title: "Ações", key: "actions"},
]
onMounted(()=>{
  getItemsList()
})
const permissoes = {edit: true}
const page = ref<number>(0)
const clienteSelected = ref<any>({})
const searchModel = ref<Filter>({type: "", value: ""})
const items = ref<any[]>([])
const filters = [{id: "nome", descricao: "Nome"}, {id: "documento", descricao: "Documento Principal (sem pontuação)"}]
const snackbar = useSnackbarStore();
function verifyGetFunction(){
  if(searchModel.value.value.length > 0){
    search(searchModel.value)
  }
  else{
    getItemsList()
  }
}
function openViewModal(item: any){
  console.log(item)
}
function editViewModal(item: any){
  clienteSelected.value = item
  dialogComponent.value = true
}
function newClient(){
  dialogComponent.value = true
}
async function search(model: Filter): Promise<void> {
  searchModel.value = model

  loadingTable.value = true
  try {
    const {clientes, pagination, count, message} = await searchClientsPaginated(searchModel.value)
    items.value = clientes;
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
async function getItemsList(){
  loadingTable.value = true

  try {
    const {clientes, pagination, count, message} = await getClientsPaginated()
    items.value = clientes;
    totalItems.value = count;
    page.value = Number(pagination.atualPagina);
    snackbar.trigger(`${message}!`, "success")
  }
  catch (error: any) {
  verifyError(error)
  }
  finally {
    loadingTable.value = false
  }
}
</script>
<style scoped>

</style>