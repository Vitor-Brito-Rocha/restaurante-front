<template>
  <div class="w-100 h-100">
    <div class="w-100 d-flex gap-4 align-top justify-end">
      <reload-create suf="a" tela="Categoria" :permissoes="permissoes"  @reload="verifyGetFunction()" @create="newClient" />
    </div>
    <div class="h-75 mt-2 mb-2 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction($event)" @deleteModal="deletarCategoria($event)" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <CategoriaComponent :dados="categoriaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {getCategoriasPaginated, deleteCategoria} from "@/services/tipo/categoria/categoria.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import ReloadCreate from "@/components/templates/reload-create.vue";
import {getRoute, verifyPermission} from "@/services/auth/auth.service.ts";
import CategoriaComponent from "@/components/types/categories/Categoria-Component.vue";
import type Permissao from "@/models/Permissao.ts";
import {verifyError} from "@/services/system/system.service.ts";
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
onMounted(()=>{
  getItemsList()
})
const permissoes = ref<Permissao>(verifyPermission(getRoute()))
const page = ref<number>(1)
const offset = ref<number>(10)
const categoriaSelected = ref<any>({})
function verifyGetFunction(pagination?: {page: number, offset: number}) {
  page.value = pagination?.page ?? page.value
  offset.value = pagination?.offset ?? offset.value
  getItemsList()
}
function editViewModal(item: any){
  categoriaSelected.value = item
  dialogComponent.value = true
}
async function deletarCategoria(id: number){
  try {
    await deleteCategoria(id)
    snackbar.trigger("Sucesso ao excluir categoria!", "success")
    verifyGetFunction()
  }catch (error: any){
    snackbar.trigger("Não foi possível excluir essa categoria, tente novamente mais tarde!", "error")

  }
}
function newClient(){
  categoriaSelected.value = {}
  dialogComponent.value = true
}
async function getItemsList() {
  loadingTable.value = true

  try {
    const {categorias, message, count, pagination} = await getCategoriasPaginated(page.value, offset.value)
    items.value = categorias
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
