  <template>
    <div class="w-100 h-100">
      <div class="w-100 d-flex gap-4 align-top justify-end">
        <reload-create suf="o" tela="Funcionário" @reload="verifyGetFunction()" :permissoes="permissoes" @create="newClient" />
      </div>
      <div class="mt-2 mb-2 w-100">
        <SearchFilter @search-event="search($event)" @reload-table="verifyGetFunction()" :filters="filters"></SearchFilter>
      </div>
      <div class="h-75 w-100">
        <CommomTableList :data="items" :headers="headers" :permissoes="permissoes" :per-page="offset" :totalItems="totalItems" :page="page" :loading="loadingTable" @verify="verifyGetFunction($event)" @deleteModal="deletarMesa($event)" @editModal="editViewModal" />
      </div>
      <v-dialog v-model="dialogComponent">
        <FuncionarioComponent :dados="mesaSelected" @close="() => {dialogComponent = false; verifyGetFunction()}" />
      </v-dialog>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import {
    deleteFuncionario,
    getFuncionarioPaginated,
    searchFuncionarioPaginated
  } from "@/services/funcionario/funcionario.service.ts";
  import {useSnackbarStore} from "@/stores/snackbar.ts";
  import CommomTableList from "@/components/templates/commom-table-list.vue";
  import ReloadCreate from "@/components/templates/reload-create.vue";
  import {getRoute, verifyPermission} from "@/services/auth/auth.service.ts";
  import SearchFilter from "@/components/search/SearchFilter.vue";
  import FuncionarioComponent from "@/components/registers/Funcionario/Funcionario-Component.vue";
  import type {Filter} from "@/models/Filter.ts";
  const snackbar = useSnackbarStore()
  const items = ref<any[]>([]);
  const dialogComponent = ref(false)
  const searchModel = ref<Filter>({type: "", value: ""})
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
        getItemsList()
  })
  const page = ref<number>(1)
  const offset = ref<number>(10)
  const mesaSelected = ref<any>({})
  const filters = ref<{id: number | string, descricao: string }[]>([{id: 'nome', descricao: 'Nome (Completo / Social)'}, {id: 'documento', descricao: 'Documento (CPF / CNPJ)'}])
  function verifyGetFunction(pagination?: {page: number, offset: number}) {
    page.value = pagination?.page ?? page.value
    offset.value = pagination?.offset ?? offset.value
    if(searchModel.value.value.length > 0){
      search(searchModel.value)
    } else{
    getItemsList()
    }
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
  async function search(model: Filter): Promise<void> {
    searchModel.value = model

    loadingTable.value = true
    try {
      const {funcionarios, pagination, count, message} = await searchFuncionarioPaginated(searchModel.value, page.value, offset.value)
      items.value = funcionarios;
      totalItems.value = pagination.totalItens ?? totalItems.value;
      page.value = pagination.paginaAtual ?? page.value;
      offset.value = pagination.itensPorPagina ?? offset.value
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
      const {funcionarios, message, count, pagination} = await getFuncionarioPaginated(page.value, offset.value)
      items.value = funcionarios
      totalItems.value = count;
      page.value = Number(pagination.paginaAtual);
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
