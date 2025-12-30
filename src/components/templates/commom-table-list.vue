<template>
  <v-data-table-server
      height="50dvh"
      v-if="!noContent && !isMobile()"
      :items-per-page-options="[{value: 5, title: '5'}, {value: 10, title: '10'}, {value: 25, title: '25'}, {value: 50, title: '50'}]"
      :items-length="props.totalItems"
      hover
      :page="props.page"
      :items-per-page="props.perPage"
      disable-sort
      :loading="props.loading"
      :headers="props.headers"
      @update:options="o => {
  if (isFirstEmit) {
    isFirstEmit = false
    return
  }

  $emit('verify', {
    page: o.page,
    offset: o.itemsPerPage
  })
}"
      :items="props.data"
      fixed-header
      class="w-100 h-100 rounded border">

      <!--    PARA CLIENTES-->
    <template v-slot:item.data_ultima_visita="{ item }">
      {{ item.data_ultima_visita ? item.data_ultima_visita : 'Não Informado' }}
    </template>
    <template v-slot:item.ativo="{ item }">
      {{ item.ativo ? 'Ativo' : 'Inativo' }}
    </template>
    <template v-slot:item.documento="{ item }">
      {{ item.documento.length===11 ? formatCpf(item.documento) : item.documento.length===14 ? formatCnpj(item.documento) : 'Não informado' }}
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
    <v-container
        v-else-if="!noContent && isMobile()">
      <v-row dense>

          <v-card v-for="item in props.data"
                  :key="item" variant="outlined" style="min-width: 100% !important; min-height: 100% !important;" class="mb-3">

            <!-- TÍTULO -->
            <v-card-title class="font-weight-bold">
              <v-row dense>
                <v-col
                    v-for="header in headers"
                    :key="header.key"
                >
                  <div
                      v-if="header.key !== 'actions'"
                  >
                  <strong>{{ header.title }}: </strong>

                  <!-- FORMATAÇÕES ESPECIAIS -->
                  <template v-if="header.key === 'documento'">
                    {{
                      item.documento?.length === 11
                          ? formatCpf(item.documento)
                          : item.documento?.length === 14
                              ? formatCnpj(item.documento)
                              : 'Não informado'
                    }}
                  </template>
                    <template v-else-if="header.key === 'updatedAt'">
                      {{ item.updatedAt.split('T')[0].split('-').reverse().join('/') + ' ' + item.updatedAt.split('T')[1].split('.')[0] }}
                    </template>
                  <template v-else-if="header.key === 'ativo'">
                    {{ item.ativo ? 'Ativo' : 'Inativo' }}
                  </template>

                  <template v-else>
                    {{ item[header.key] ?? '—' }}
                  </template>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>

            <v-divider />

            <!-- AÇÕES -->
            <v-card-actions class="justify-end ga-2">

              <v-tooltip v-if="permissoes.visualize" text="Visualizar">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" @click="$emit('view-modal', item)">
                    <v-icon icon="mdi-eye" />
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip v-if="permissoes.edit" text="Editar">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" @click="$emit('edit-modal', item)">
                    <v-icon icon="mdi-pencil" />
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip v-if="permissoes.delete" text="Excluir">
                <template #activator="{ props }">
                  <v-btn v-bind="props" icon size="small" @click="$emit('delete-modal', item.id)">
                    <v-icon icon="mdi-delete" />
                  </v-btn>
                </template>
              </v-tooltip>
              <v-tooltip v-if="permissoes.customize" text="Customizar">
                <template #activator="{ props }">
                <v-btn size="small" icon @click="$emit('customize-modal', item)">
                <v-icon icon="mdi-cog"></v-icon>
              </v-btn>
                </template>
              </v-tooltip>

            </v-card-actions>

          </v-card>

      </v-row>
      <div v-if="totalItems>props.data.length">
        <v-btn @click="loadMore">Próxima Página</v-btn>
      </div>
    </v-container>

  <div v-else>
    Não há registros no momento.
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {isMobile} from "@/services/system/system.service.ts";
const emit = defineEmits(['verify', 'view-modal', 'edit-modal', 'customize-modal', 'delete-modal']);
const noContent = ref(false)
const isFirstEmit = ref(true)
const mobileItems = ref<any[]>([])
const mobilePage = ref(1)
const mobileLoading = ref(false)
const mobileFinished = ref(false)
onMounted(()=>{
  if(isMobile() && props.data.length>0){
  mobileItems.value.push(...props.data)
  }
})
const props = defineProps<{
  data: any[],
  headers: any[],
  permissoes: {edit?: boolean, delete?: boolean, customize?: boolean, visualize?: boolean, create?: boolean},
  totalItems: number,
  perPage: number,
  page: number,
  loading?: boolean,
}>()
function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}
function formatCpf(cpf: string) {
  const digits = onlyDigits(cpf);

  if (digits.length !== 11) return cpf;

  return digits.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
  );
}
function formatCnpj(cnpj: string) {
  const digits = onlyDigits(cnpj);

  if (digits.length !== 14) return cnpj;

  return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
  );
}
const loadMore = async ({ done }: any) => {
  mobilePage.value++
  emit('verify', {
    page: mobilePage.value,
    offset: props.perPage
  })
}

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