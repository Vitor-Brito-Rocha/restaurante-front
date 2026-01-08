<template>
  <div class="gestao-mesas">
      <div
        ref="gridRef"
        class="grid-container"
        :style="{
        backgroundColor: vuetifyTheme.current.value.dark ? '#413e3e' : '#F5F5F5',
        gridTemplateColumns: `repeat(${ambiente.linhas}, 1fr)`,
        gridTemplateRows: `repeat(${ambiente.colunas}, 1fr)`
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
    <MesaStatus :dados="mesaSelected" @close="dialogView = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, ref, reactive, onBeforeMount} from 'vue';
import { useTheme } from "vuetify";
import MesaStatus from "@/components/mesa/Mesa-Status.vue";
import type {Mesa} from "@/models/Mesa.ts";
import type {Ambiente} from "@/models/Registros/Ambiente.ts";

const vuetifyTheme = useTheme();
const gridRef = ref<HTMLElement | null>(null);
const mesas = ref<Mesa[]>([])
const props = defineProps<{
  data: Mesa[]
  ambiente?: Ambiente
}>()
const ambiente = { id: 1, descricao: 'Sala 1', linhas: props.ambiente?.linha_max ?? 0, colunas: props.ambiente?.coluna_max ?? 0};
onBeforeMount(()=>{
  mesas.value = props.data
})
const mesaSendoArrastada = ref<any>(null);
const mesaComShake = ref<number | null>(null);
const dragVisual = reactive({ active: false, x: 0, y: 0 });
let startPos = { x: 0, y: 0 };
let isLongPress = false;
let timerLongPress: any = null;

const grid = computed(() => {
  const matriz = [];
  for (let r = 0; r < ambiente.linhas; r++) {
    const linha = [];
    for (let c = 0; c < ambiente.colunas; c++) {
      const mesa = mesas.value.find(m => m.linha === r && m.coluna === c);
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

    const coluna = Math.floor(x / (rect.width / ambiente.colunas));
    const linha = Math.floor(y / (rect.height / ambiente.linhas));

    if (linha >= 0 && linha < ambiente.linhas && coluna >= 0 && coluna < ambiente.colunas) {
      executarMovimento(linha, coluna);
    }
  }

  dragVisual.active = false;
  mesaSendoArrastada.value = null;
};

const executarMovimento = (targetlinha: number, targetCol: number) => {
  const mesaOriginal = mesaSendoArrastada.value;
  const mesaNoDestino = mesas.value.find(m => m.linha === targetlinha && m.coluna === targetCol);

  if (mesaNoDestino && mesaNoDestino.id !== mesaOriginal.id) {
    const oldlinha = mesaOriginal.linha;
    const oldCol = mesaOriginal.coluna;
    mesaOriginal.linha = targetlinha;
    mesaOriginal.coluna = targetCol;
    mesaNoDestino.linha = oldlinha;
    mesaNoDestino.coluna = oldCol;
  } else {
    mesaOriginal.linha = targetlinha;
    mesaOriginal.coluna = targetCol;
  }
};
const mesaSelected = ref<any>(null)
const handleMesaClick = (mesa: any) => {
  if (isLongPress) return; // Se foi arraste, não muda status
  clearTimeout(timerLongPress);
  mesaSelected.value = mesa
  dialogView.value = true
  setTimeout(() => mesaComShake.value = null, 500);
};

const addMesa = (r: number, c: number) => {
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