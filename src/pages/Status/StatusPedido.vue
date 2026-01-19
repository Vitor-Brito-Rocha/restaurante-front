<template>
  <div class="w-100 h-100">
    <div class="w-100 d-flex gap-4 align-top justify-end">
      <reload-create suf="o" tela="Status" :permissoes="permissoes"  @reload="verifyGetFunction()" @create="newClient" />
    </div>
    <div class="h-75 mt-2 mb-2 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction($event)" @deleteModal="deletarMesa($event)" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <StatusPedidoComponent :dados="mesaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {deleteStatusPedido, getStatusPedidoPaginated} from "@/services/pedido/status-pedido.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import ReloadCreate from "@/components/templates/reload-create.vue";
import {getRoute, verifyPermission} from "@/services/auth/auth.service.ts";
import StatusPedidoComponent from "@/components/status/StatusPedido/Status-Pedido-Component.vue";
import type Permissao from "@/models/Permissao.ts";
import {verifyError} from "@/services/system/system.service.ts";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = computed(() => {
  const base = [
    { title: 'Código', key: 'id' },
    { title: 'Descrição', key: 'descricao' },
  ]

  const hasActions =
      permissoes.value.edit ||
      permissoes.value.delete ||
      permissoes.value.customize

  return hasActions
      ? [...base, { title: 'Ações', key: 'actions' }]
      : base
})
const permissoes = ref<Permissao>(verifyPermission(getRoute()))
onMounted(()=>{
  getItemsList()
  permissoes.value = {...permissoes.value, edit: false, delete: false}

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
async function deletarMesa(id: number){
  try {
    await deleteStatusPedido(id)
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
    const {statusPedidos, message, count, pagination} = await getStatusPedidoPaginated(page.value, offset.value)
    items.value = statusPedidos
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
