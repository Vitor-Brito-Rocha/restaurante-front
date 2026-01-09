<template>
  <div class="gestao-mesas">
      <div
        ref="gridRef"
        class="grid-container"
        :style="{
        backgroundColor: vuetifyTheme.current.value.dark ? '#413e3e' : '#F5F5F5',
        gridTemplateRows: `repeat(${props.ambiente?.linha_max!}, 1fr)`,
        gridTemplateColumns: `repeat(${props.ambiente?.coluna_max!}, 1fr)`,
      }"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
    >
      <template v-for="(linha, r) in grid" :key="'linha-'+r">
        <div
            v-for="(celula, c) in linha"
            :key="c"
            class="celula"
            :data-linha="r"
            :data-coluna="c"
        >
          <div
              v-if="celula"
              class="mesa-content"
              :class="[
    celula.status_descricao === 'Livre' ? 'bg-success' : 'bg-error',
    {
      'shake': mesaComShake === celula.id,
      'is-pressed': isDraggingMode // Nova classe para feedback
    }
  ]"
              @pointerdown="onPointerDown($event, celula)"
              @click.stop="handleMesaClick(celula)"
          >
            <span class="label">M{{ celula.id }}</span>
            <span class="capacidade">{{ celula.capacidade }}P</span>
          </div>

          <div v-else class="vazio-content" @click="addMesa(r, c)">
            <small>+</small>
          </div>
        </div>
      </template>

      <div
          v-if="dragVisual.active"
          class="drag-ghost"
          :class="mesaSendoArrastada?.status_descricao === 'Livre' ? 'bg-success' : 'bg-error'"
          :style="{ left: dragVisual.x + 'px', top: dragVisual.y + 'px' }"
      >
        M{{ mesaSendoArrastada?.id }}
      </div>
    </div>
  </div>
  <v-dialog v-model="dialogView">
    <MesaStatus :dados="mesaSelected" @update="()=>{$emit('refresh'); dialogView = false}" @close="dialogView = false" />
  </v-dialog>
  <v-dialog v-model="dialogView2">
    <MesaComponent :dados="mesaCreating" @close="()=>{$emit('refresh'); dialogView2 = false; mesaCreating = {}}" />
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, ref, reactive, onBeforeMount, shallowRef, watch} from 'vue';
import { useTheme } from "vuetify";
import MesaStatus from "@/components/mesa/Mesa-Status.vue";
import type {Mesa} from "@/models/Mesa.ts";
import type {Ambiente} from "@/models/Registros/Ambiente.ts";
import {createMesa, updateMesa} from "@/services/mesa/mesa.service.ts";
import MesaComponent from "@/components/mesa/Mesa-Component.vue";
import {verifyError} from "@/services/system/system.service.ts";
const vuetifyTheme = useTheme();
const dialogView2 = ref(false)
const gridRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['refresh'])
const props = defineProps<{
  data: Mesa[]
  ambiente?: Ambiente
}>()
const mesaCreating = ref<Mesa>({});
const mesaSendoArrastada = ref<any>(null);
const mesaComShake = ref<number | null>(null);
const dragVisual = reactive({ active: false, x: 0, y: 0 });
let startPos = { x: 0, y: 0 };
let isLongPress = false;
let timerLongPress: any = null;

const grid = computed(() => {
  const matriz = [];
  for (let r = 1; r <= props.ambiente?.linha_max!; r++) {
    const linha = [];
    for (let c = 1; c <= props.ambiente?.coluna_max!; c++) {
      const mesa = props.data.find(m => m.linha === r && m.coluna === c);
      linha.push(mesa || null);
    }
    matriz.push(linha);
  }
  return matriz;
});

// --- LÓGICA DE MOVIMENTO UNIVERSAL ---
const isDraggingMode = ref(false); // Novo estado
const dialogView = ref(false); // Novo estado

const onPointerDown = (e: PointerEvent, mesa: any) => {
  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  startPos = { x: e.clientX, y: e.clientY };
  isLongPress = false;
  isDraggingMode.value = false; // Reset no início

  timerLongPress = setTimeout(() => {
    isLongPress = true;
    isDraggingMode.value = true; // Ativa o visual de arraste
    mesaSendoArrastada.value = mesa;
    dragVisual.active = true;
    dragVisual.x = e.clientX - 30;
    dragVisual.y = e.clientY - 30;
  }, 300);
};

const onPointerMove = (e: PointerEvent) => {
  if (!dragVisual.active) return;

  dragVisual.x = e.clientX - 30;
  dragVisual.y = e.clientY - 30;
};

const onPointerUp = (e: PointerEvent) => {
  clearTimeout(timerLongPress);
  isDraggingMode.value = false;
  if (!dragVisual.active) return;

  // Descobre onde soltou baseado nas coordenadas do grid
  if (gridRef.value) {
    const rect = gridRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const coluna = Math.floor(x / (rect.width / props.ambiente?.coluna_max!));
    const linha = Math.floor(y / (rect.height / props.ambiente?.linha_max!));

    if (linha >= 0 && linha < props.ambiente?.linha_max! && coluna >= 0 && coluna < props.ambiente?.coluna_max!) {
      console.log('chamou executar mov')
      executarMovimento(linha+1, coluna+1);
      return;
    }

  }

  dragVisual.active = false;
  mesaSendoArrastada.value = null;
};

const executarMovimento = async (targetlinha: number, targetCol: number) => {
  const mesaOriginal = mesaSendoArrastada.value;
  const mesaNoDestino = props.data.find(m => m.linha === targetlinha && m.coluna === targetCol);
try{

  if (mesaNoDestino && mesaNoDestino.id !== mesaOriginal.id) {
    const oldlinha = mesaOriginal.linha;
    const oldCol = mesaOriginal.coluna;
    mesaOriginal.linha = targetlinha;
    mesaOriginal.coluna = targetCol;
    mesaNoDestino.linha = oldlinha;
    mesaNoDestino.coluna = oldCol;
    await Promise.all([
      editarMesa(mesaOriginal, targetlinha, targetCol),
      editarMesa(mesaNoDestino, oldlinha, oldCol)
    ])
  } else {
    mesaOriginal.linha = targetlinha;
    mesaOriginal.coluna = targetCol;
    await editarMesa(mesaOriginal, targetlinha, targetCol)
  }
  emit("refresh")
} catch(error) {
  verifyError(error)
}

  dragVisual.active = false;
  mesaSendoArrastada.value = null;
};
async function editarMesa(mesa: any, linha: number, coluna: number) {
  try{
    await updateMesa(mesa.id, {linha: linha, coluna: coluna});
  } catch (error) {
    verifyError(error)
  }
}
const mesaSelected = ref<any>(null)
const handleMesaClick = (mesa: any) => {
  if (isLongPress) return; // Se foi arraste, não muda status
  clearTimeout(timerLongPress);
  mesaSelected.value = mesa
  dialogView.value = true
  setTimeout(() => mesaComShake.value = null, 500);
};

const addMesa = async (r: number, c: number) => {
  mesaCreating.value = {linha: r+1, coluna: c+1, ambiente_id: props.ambiente?.id};
  dialogView2.value = true
  console.log(`Adicionando na linha ${r + 1}, coluna ${c + 1}`);
};
</script>

<style scoped>
.grid-container {
  display: grid;
  gap: 8px;
  padding: 15px;
  border-radius: 8px;
  position: relative;
  touch-action: none; /* Bloqueia o scroll do Safari para o Pointer funcionar */
  user-select: none;
}

.celula {
  aspect-ratio: 1 / 1;
  border: 1px dashed #ccc;
  border-radius: 4px;
  position: relative;
}

.mesa-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: white;
  transition: transform 0.2s, background-color 0.3s;

  /* CURSOR PADRÃO: Mãozinha de clique (Pointer) */
  cursor: pointer;

  touch-action: none;
  user-select: none;
}

/* Quando o usuário clica e segura, mudamos para o cursor de "pegar" */
.mesa-content:active {
  cursor: grabbing;
}

/* Se você estiver no computador e quiser aquele feedback de "pode arrastar" */
.mesa-content.dragging {
  cursor: grabbing;
  opacity: 0.4;
}

/* Estilo do Vazio para indicar adição */
.vazio-content {
  cursor: cell; /* Aquele cursor de "mais" ou seleção */
  /* ... resto do estilo ... */
}

.mesa-content.dragging {
  opacity: 0.4;
}

.drag-ghost {
  position: fixed;
  width: 60px;
  height: 60px;
  pointer-events: none; /* Importante para não bloquear o onPointerUp */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  transform: scale(1.1);
}

.vazio-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
}

.bg-success { background-color: #4caf50; }
.bg-error { background-color: #f44336; }
/* Quando o Long Press ativa, a mesa de origem dá um "pulo" ou encolunahe */
.is-pressed {
  transform: scale(0.9);
  filter: brightness(0.8);
}
@keyframes shake-animation {
  0% { transform: scale(1); }
  25% { transform: scale(1.1) rotate(2deg); }
  50% { transform: scale(1.1) rotate(-2deg); }
  100% { transform: scale(1); }
}
.shake { animation: shake-animation 0.4s ease-in-out; }
</style>