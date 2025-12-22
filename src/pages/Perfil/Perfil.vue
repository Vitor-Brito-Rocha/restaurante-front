<template>
  <div class="w-100 h-100 pr-4">
    <div class="w-100 d-flex gap-2 align-top justify-end">
      <reload-create suf="o" tela="Perfil" :permissoes="permissoes" @reload="getItemsList()" @create="newClient" />
    </div>
    <div class="h-75 mt-2 w-100">
      <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :perPage="offset" :total-items="totalItems" :page="page" :loading="loadingTable" @verify="getItemsList" @customizeModal="editPermissions($event)" @deleteModal="deletarMesa($event)" @editModal="editViewModal" />
    </div>
    <v-dialog v-model="dialogComponent">
      <PerfilComponent :dados="mesaSelected" @close="() => {dialogComponent = false; getItemsList()}" />
    </v-dialog>
    <v-dialog v-model="dialogComponent2">
      <PerfilPermissoesComponent :dados="mesaSelected" @close="() => {dialogComponent2 = false; getItemsList()}" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {useSnackbarStore} from "@/stores/snackbar.ts";
import CommomTableList from "@/components/templates/commom-table-list.vue";
import ReloadCreate from "@/components/templates/reload-create.vue";
import {deletePerfil, getPerfisPaginated} from "@/services/perfil/perfil.service.ts";
import PerfilComponent from "@/components/profile/Perfil-Component.vue";
import {getRoute, verifyPermission} from "@/services/auth/auth.service.ts";
import PerfilPermissoesComponent from "@/components/profile/Perfil-Permissoes-Component.vue";
const snackbar = useSnackbarStore()
const items = ref<any[]>([]);
const dialogComponent = ref(false)
const dialogComponent2 = ref(false)
const loadingTable = ref<boolean>(false)
const totalItems = ref<number>(0)
const headers = [
  {title: 'Código', key: 'id'},
  {title: 'Descrição', key: 'descricao'},
  {title: 'Ações', key: 'actions'},
]
const permissoes = ref<{edit?: boolean, list?: boolean, delete?: boolean, create?: boolean, customize?: boolean}>(verifyPermission(getRoute()))
onMounted(async ()=>{
  try {
    permissoes.value.customize = true
      await getItemsList()
  } catch (e: any) {
  }
})
const page = ref<number>(1)
const offset = ref<number>(10)
const mesaSelected = ref<any>({})
function editViewModal(item: any){
  mesaSelected.value = item
  dialogComponent.value = true
}
function editPermissions(item: any){
  mesaSelected.value = item
  dialogComponent2.value = true
}
async function deletarMesa(id: number){
  try {
    await deletePerfil(id)
    snackbar.trigger("Sucesso ao excluir mesa!", "success")
    await getItemsList()
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
    const {perfis, message, count, pagination} = await getPerfisPaginated(page.value, offset.value)
    items.value = perfis
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
