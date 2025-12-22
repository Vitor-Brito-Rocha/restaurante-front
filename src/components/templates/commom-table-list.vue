<template>
  <v-data-table-server
      height="600"
      v-if="!noContent"
      :items-per-page-options="[{value: 5, title: '5'}, {value: 10, title: '10'}, {value: 25, title: '25'}, {value: 50, title: '50'}]"
      :items-length="totalItems"
      hover
      :page="props.page"
      :items-per-page="props.perPage"
      disable-sort
      :loading="props.loading"
      :headers="props.headers"
      @update:options="o => $emit('verify', { page: o.page, offset: o.itemsPerPage })"
      :items="props.data"
      fixed-header
      class="w-100 h-100 rounded border">

      <!--    PARA CLIENTES-->
    <template v-slot:item.data_ultima_visita="{ item }">
      {{ item.data_ultima_visita ? item.data_ultima_visita : 'Não Informado' }}
    </template>
    <template v-slot:item.idade="{ item }">
      {{ verifyAge(item?.data_nascimento) }}
    </template>
<!--        PARA MESAS     -->
    <template v-slot:item.updatedAt="{ item }">
      {{ item.updatedAt.split('T')[0].split('-').reverse().join('/') + ' ' + item.updatedAt.split('T')[1].split('.')[0] }}
    </template>
    <template  v-slot:item.actions="{ item }">
      <div class="ga-5">
      <v-btn v-if="permissoes.visualize" variant="flat" size="small" icon @click="$emit('view-modal', item)">
        <v-icon icon="mdi-eye"></v-icon>
      </v-btn>
      <v-btn v-if="permissoes.edit" variant="flat" size="small" icon @click="$emit('edit-modal', item)">
        <v-icon icon="mdi-pencil"></v-icon>
      </v-btn>
      <v-btn v-if="permissoes.delete" variant="flat" size="small" icon @click="$emit('delete-modal', item.id)">
        <v-icon icon="mdi-delete"></v-icon>
      </v-btn>
      <v-btn v-if="permissoes.customize" variant="flat" size="small" icon @click="$emit('customize-modal', item)">
        <v-icon icon="mdi-cog"></v-icon>
      </v-btn>
      </div>
    </template>
  </v-data-table-server>
  <div v-else>
    Não há registros no momento.
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
const emit = defineEmits(['verify', 'view-modal', 'edit-modal', 'customize-modal', 'delete-modal']);
const noContent = ref(false)
const props = defineProps<{
  data: any[],
  headers: any[],
  permissoes: {edit?: boolean, delete?: boolean, customize?: boolean, visualize?: boolean, create?: boolean},
  totalItems: number,
  perPage: number,
  page: number,
  loading?: boolean,
}>()
const permissoes = ref<{edit?: boolean, visualize?: boolean, delete?: boolean, customize?: boolean}>({visualize: false, edit: false, delete: false, customize: false})
onMounted(()=>{
  permissoes.value = props.permissoes
})









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
</script>


<style scoped>

</style>