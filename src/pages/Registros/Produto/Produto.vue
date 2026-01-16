<template>
  <div class="w-100 h-100">
    <div class="w-100 d-flex gap-4 align-top justify-end">
      <reload-create suf="o" tela="Produto" :permissoes="permissoes" @reload="verifyGetFunction()" @create="newClient" />
    </div>
    <div class="h-75 mt-2 mb-2 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction($event)" @deleteModal="deletarAmbiente($event)" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <ProdutoComponent :dados="mesaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import ReloadCreate from "@/components/templates/reload-create.vue";
import AmbienteComponent from "@/components/registers/ambiente/Ambiente-Component.vue";
import {deleteAmbiente, getAmbientePaginated} from "@/services/cadastro/ambiente/ambiente.service.ts";
import {getRoute, logout, verifyPermission} from "@/services/auth/auth.service.ts";
import type Permissao from "@/models/Permissao.ts";
import {verifyError} from "@/services/system/system.service.ts";
import {getProdutoPaginated} from "@/services/cadastro/produto/produto.service.ts";
import ProdutoComponent from "@/components/registers/produto/Produto-Component.vue";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = [
  {title: 'Código', key: 'id'},
  {title: 'Nome', key: 'nome'},
  {title: 'Descrição', key: 'descricao'},
  {title: 'Preço', key: 'preco'},
  {title: 'Categoria', key: 'categoria_descricao'},
  {title: 'Ativo', key: 'ativo'},
  {title: 'Ações', key: 'actions'},
]
const permissoes = ref<Permissao>(verifyPermission(getRoute()))
onMounted(getItemsList)
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
    const {produtos, message, count, pagination} = await getProdutoPaginated(page.value, offset.value)
    items.value = produtos
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
