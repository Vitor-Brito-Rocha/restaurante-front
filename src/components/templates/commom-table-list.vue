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
      @update:options="onUpdateOptions"
      :loading="props.loading"
      :headers="props.headers"
      :items="props.data"
      fixed-header
      class="w-100 h-100 rounded border">

      <!--    PARA CLIENTES-->
    <template v-slot:item.data_ultima_visita="{ item }">
      {{ item.data_ultima_visita ? item.data_ultima_visita : 'Não Informado' }}
    </template>
    <template v-slot:item.ativo="{ item }">
      <v-switch
          hide-details
          v-model="item.ativo"
          @update:model-value="$emit('update-status', {status: item.ativo, id: item.id})"
      :label="item.ativo ? 'Ativo' : 'Inativo'">
      </v-switch>
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
  <v-pull-to-refresh
      v-if="isMobile()"
      @load="load">
    <v-container
        v-if="!noContent && isMobile()">
      <v-row dense>
        <v-card
            v-for="item in props.data"
            :key="item.id"
            v-click-outside="closeSwipe"
            @touchstart="(e: any) => handleTouchStart(e, item.id)"
            @touchmove="(e: any) => handleTouchMove(e, item.id)"
            @touchend="handleTouchEnd(item.id)"
            :class="{ 'swiped-mode': swipedItemId === item.id }"
            :style="{
    backgroundColor: (activeId === item.id && currentOffset < 0) || swipedItemId === item.id ? '#ff5252' : 'transparent',
    touchAction: 'pan-y'
  }"
            class="swipe-container mb-3 border-2 w-100"
            variant="outlined"
        >
          <div class="delete-action"
               @pointerdown.stop="$emit('delete-modal', item.id)">
            <v-icon icon="mdi-delete" color="white"></v-icon>
          </div>

          <div
              class="card-content-wrapper bg-surface h-100"
              :style="{
      transform: activeId === item.id ? `translateX(${currentOffset}px)` : (swipedItemId === item.id ? 'translateX(-80px)' : 'translateX(0)')
    }"
          >
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-start mb-2">
                <div class="text-h6 font-weight-bold primary--text">
                  {{ item[headers[0].key] }}
                </div>
                <v-chip
                    v-if="item.hasOwnProperty('ativo')"
                    :color="item.ativo ? 'success' : 'error'"
                    label
                    class="cursor-pointer"
                    @click.stop="$emit('update-status', {status: item.ativo, id: item.id})"
                >
                  {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </div>

              <v-row dense>
                <v-col
                    v-for="header in headers"
                    :key="header.key"
                    cols="12"
                    class="py-0"
                >
                  <div class="d-flex py-1 text-body-2" v-if="header.key !== 'actions' && header.key !== 'ativo'">
                    <span class="text-medium-emphasis mr-2" style="min-width: 80px;">{{ header.title }}:</span>
                    <span class="text-high-emphasis">
              <template v-if="header.key === 'documento'">{{ formatCnpj(item[header.key]) }}</template>
              <template v-else-if="header.key === 'updatedAt'">
                {{ item.updatedAt.split('T')[0].split('-').reverse().join('/') + ' ' + item.updatedAt.split('T')[1].split('.')[0] }}
              </template>
              <template v-else>{{ item[header.key] ?? '—' }}</template>
            </span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="bg-grey-darken-4 px-3">
              <v-spacer></v-spacer>
              <v-btn v-if="permissoes.edit" icon="mdi-pencil" size="small" variant="text" @click.stop="$emit('edit-modal', item)"></v-btn>
              <v-btn v-if="permissoes.customize" icon="mdi-cog" size="small" variant="text" @click="$emit('customize-modal', item)"></v-btn>
            </v-card-actions>
          </div>
        </v-card>      </v-row>
      <div class="w-100 justify-content-between d-flex ga-4 px-2 gap-4" v-if="totalItems>props.data.length">
        <v-btn @click="loadLess" :disabled="mobilePage==1">Voltar</v-btn>
        <v-btn @click="loadMore" :disabled="mobilePage>totalItems/perPage">Avançar</v-btn>
      </div>
    </v-container>
  <div v-else>
    Não há registros no momento.
  </div>
  </v-pull-to-refresh>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {isMobile} from "@/services/system/system.service.ts";
const emit = defineEmits(['update-status','verify', 'view-modal', 'edit-modal', 'customize-modal', 'delete-modal']);
const props = defineProps<{
  data: any[],
  headers: any[],
  permissoes: {edit?: boolean, delete?: boolean, customize?: boolean, visualize?: boolean, create?: boolean},
  totalItems: number,
  perPage: number,
  page: number,
  loading?: boolean,
}>()

const noContent = ref(false)
const isFirstEmit = ref(true)
const mobilePage = ref(1)
const touchStartX = ref(0);
const currentOffset = ref(0);
const activeId = ref(null);

function handleTouchStart(e: TouchEvent, id: any) {
  if (swipedItemId.value !== id) {
    swipedItemId.value = null;
  }

  touchStartX.value = e.touches[0].clientX;
  activeId.value = id;
}

function handleTouchMove(e: TouchEvent, id: any) {
  if (activeId.value !== id) return;

  const x = e.touches[0].clientX;
  const walk = x - touchStartX.value;

  // Se o card já está aberto (swiped), o ponto de partida visual é -80
  const startOffset = swipedItemId.value === id ? -80 : 0;
  const newOffset = startOffset + walk;

  // Limita para não deixar arrastar muito para a direita (max 0)
  // e nem muito para a esquerda (max -120)
  if (newOffset <= 0 && newOffset >= -120) {
    currentOffset.value = newOffset;
  }
}
function closeSwipe() {
  swipedItemId.value = null;
  activeId.value = null;
  currentOffset.value = 0;
}
const lastOptions = ref({
  page: props.page,
  itemsPerPage: props.perPage
})
function onUpdateOptions(o: any) {
  const pageChanged = o.page !== lastOptions.value.page
  const perPageChanged = o.itemsPerPage !== lastOptions.value.itemsPerPage

  if (!pageChanged && !perPageChanged) return

  lastOptions.value = {
    page: o.page,
    itemsPerPage: o.itemsPerPage
  }

  emit('verify', {
    page: o.page,
    offset: o.itemsPerPage
  })
}

function handleTouchEnd(id: any) {
  // Se o card parou antes de -40px (mais perto do zero), ele fecha
  if (currentOffset.value > -40) {
    if ('vibrate' in navigator) navigator.vibrate(10); // Vibra de leve ao "travar" aberto
    swipedItemId.value = null;
  }
  // Se parou além de -40px, ele fixa no -80px (aberto)
  else {
    swipedItemId.value = id;
  }

  activeId.value = null;
  currentOffset.value = 0; // Resetamos o offset temporário
}

const swipedItemId = ref(null); // Armazena o ID do item que foi deslizado
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
const loadMore = async () => {
  mobilePage.value++
  emit('verify', {
    page: mobilePage.value,
    offset: props.perPage
  })
}
const loadLess = async () => {
  mobilePage.value--
  emit('verify', {
    page: mobilePage.value,
    offset: props.perPage
  })
}
const refreshDone = ref<null | ((status?: string) => void)>(null)

const load = async ({ done }: any) => {
  refreshDone.value = done
  mobilePage.value = 1

  emit('verify', {
    page: mobilePage.value,
    offset: props.perPage,
  })
}
import { watch } from 'vue'

watch(
    () => props.data,
    () => {
      if (refreshDone.value) {
        refreshDone.value('ok')
        refreshDone.value = null
      }
    }
)


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

.swipe-card {
  position: relative;
  background-color: #cf1010 !important; /* Cor do fundo da zona de delete */
}

.card-front {
  transition: transform 0.3s ease;
  width: 100%;
  z-index: 2;
  position: relative;
}

.offset-left .card-front {
  transform: translateX(-70px); /* O card desliza 70px para a esquerda */
}

.delete-zone {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
/* Container pai com a cor de fundo do botão de deletar */
.swipe-container {
  position: relative;
  overflow: hidden;
  /* Remova o background-color daqui para não aparecer borda vermelha no estado normal */
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.card-content-wrapper {
  transition: transform 0.3s ease;
  z-index: 2;
  position: relative;
  /* Garante que ele cubra o fundo vermelho do pai no estado normal */
  width: 100%;
  height: 100%;
}
/* Quando o ID bater, movemos a camada de cima para a esquerda */
.swiped-mode .card-content-wrapper {
  transform: translateX(-80px); /* 80px é o tamanho do botão que vai aparecer */
}

/* Estilo do botão que fica atrás */
.delete-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
}
.swipe-container {
  position: relative;
  overflow: hidden;
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  user-select: none; /* Evita selecionar texto enquanto arrasta */
}

.card-content-wrapper {
  /* will-change avisa o navegador para otimizar essa camada */
  will-change: transform;
  z-index: 2;
  position: relative;
  width: 100%;
  height: 100%;
}

.delete-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background-color: #ff5252; /* Fundo garantido */
  cursor: pointer;
}

/* Garante que o fundo vermelho apareça imediatamente no modo swiped */
.swiped-mode {
  background-color: #ff5252 !important;
}
</style>