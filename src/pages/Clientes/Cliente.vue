<template>
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
    <v-data-table-server
        :items-per-page-options="[{value: 5, title: '5'}, {value: 10, title: '10'}, {value: 25, title: '25'}, {value: 50, title: '50'}]"
        :items-length="totalItems"
        hover
        :page="page"
        disable-sort
        :headers="headers"
        @update:page="verifyGetFunction"
        @update:items-per-page="verifyGetFunction"
        :items="items"
        :loading="loadingTable"
        class="w-100 h-100">
      <template v-slot:item.data_ultima_visita="{ item }">
        {{ item.data_ultima_visita ? item.data_ultima_visita : 'Não Informado' }}
      </template>
      <template v-slot:item.idade="{ item }">
        {{ verifyAge(item?.data_nascimento) }}
      </template>
      <template  v-slot:item.actions="{ item }">
        <v-btn variant="flat" size="small" class="mr-2" icon @click="openViewModal(item)">
        <v-icon icon="mdi-eye"></v-icon>
        </v-btn>
        <v-btn variant="flat" size="small" icon @click="editViewModal(item)">
        <v-icon icon="mdi-pencil"></v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </div>
  <v-dialog v-model="dialogComponent">
    <ClienteComponent :dados="clienteSelected" @close="dialogComponent = false" />
  </v-dialog>
</template>
<script setup lang="ts">
import SearchFilter from "@/components/search/SearchFilter.vue";
import {onMounted, ref} from "vue";
import {getClientsPaginated, searchClientsPaginated} from "@/services/client/client.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import ClienteComponent from "@/components/registers/Clientes/Cliente-Component.vue";
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
const page = ref<number>(0)
const clienteSelected = ref<any>({})
const searchModel = ref<{type: string, value: string}>({type: "", value: ""})
const items = ref<any[]>([])
const filters = [{id: "nome", descricao: "Nome"}, {id: "documento", descricao: "Documento Principal (sem pontuação)"}]
const snackbar = useSnackbarStore();
  const dataHoje = new Date()
function verifyAge(dataNascimento: string | Date): number {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  // Ajusta se ainda não fez aniversário este ano
  const mesDiff = hoje.getMonth() - nascimento.getMonth();
  const diaDiff = hoje.getDate() - nascimento.getDate();
  if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
    idade--;
  }

  return idade;
}
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
async function search(model: {type: string, value: string}): Promise<void> {
  searchModel.value = model

  loadingTable.value = true
  try {
    const {clientes, pagination, count, message} = await searchClientsPaginated(searchModel.value)
    items.value = clientes;
    totalItems.value = count;
    page.value = pagination.atualPagina;
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
    page.value = pagination.atualPagina;
    snackbar.trigger(`${message}!`, "success")
  }
  catch (error: any) {
    snackbar.trigger(`${error.message}!`, "error")

  }
  finally {
    loadingTable.value = false

  }
}
</script>
<style scoped>

</style>