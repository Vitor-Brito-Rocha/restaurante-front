<template>
  <v-container class="pa-4">
    <v-sheet elevation="2" class="pa-2" style="display: inline-block;">
      <v-row
          v-for="(row, rowIndex) in matrix"
          :key="rowIndex"
          class="no-gutters"
      >
        <v-col
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            :cols="1"
            class="d-flex align-center justify-center"
            :class="getCellClass(cell)"
            style="width: 60px; height: 60px; border: 1px solid #ccc; cursor: pointer;"
            @click="toggleStatus(cell)"
            @dragover.prevent
            @drop="dropMesa($event, rowIndex, colIndex)"
            :draggable="cell.type === 'table'"
            @dragstart="dragMesa($event, cell)"
        >
          <span v-if="cell.type === 'table'">{{ cell.id }}</span>
        </v-col>
      </v-row>
    </v-sheet>

    <v-btn class="mt-4" color="primary" @click="addRandomMesa">Adicionar Mesa Aleatória</v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const mesas = ref([])
const ROWS = 6
const COLS = 8
let draggedMesa = null

// Carrega mesas do Supabase
const fetchMesas = async () => {
  const { data, error } = await supabase
      .from('mesa')
      .select('*')
  if(error) console.error(error)
  else mesas.value = data
}

// Computed para gerar matriz 2D
const matrix = computed(() => {
  const m = []
  for (let r = 0; r < ROWS; r++) {
    const row = []
    for (let c = 0; c < COLS; c++) {
      const mesa = mesas.value.find(m => {
        if(!m.localizacao) return false
        const [linha, col] = m.localizacao.split(',').map(Number)
        return linha === r && col === c
      })
      if (mesa) row.push({ type: 'table', id: mesa.id, status: mesa.status })
      else row.push({ type: 'wall' })
    }
    m.push(row)
  }
  return m
})

// Alterna status e atualiza Supabase
const toggleStatus = async (cell) => {
  if(cell.type !== 'table') return
  const mesa = mesas.value.find(m => m.id === cell.id)
  if(!mesa) return
  if(mesa.status === '1') mesa.status = '2'
  else if(mesa.status === '2') mesa.status = '3'
  else mesa.status = '1'

  // Atualiza no Supabase
  const { error } = await supabase
      .from('mesa')
      .update({ status: mesa.status })
      .eq('id', mesa.id)
  if(error) console.error(error)
}

// Drag & drop
const dragMesa = (event, cell) => { draggedMesa = cell }

const dropMesa = async (event, row, col) => {
  if(!draggedMesa) return
  const mesa = mesas.value.find(m => m.id === draggedMesa.id)
  mesa.localizacao = `${row},${col}`
  draggedMesa = null

  // Atualiza no Supabase
  const { error } = await supabase
      .from('mesa')
      .update({ localizacao: mesa.localizacao })
      .eq('id', mesa.id)
  if(error) console.error(error)
}

// Adicionar mesa aleatória
const addRandomMesa = async () => {
  const emptyCells = []
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const exists = mesas.value.find(m => {
        if(!m.localizacao) return false
        const [linha, col] = m.localizacao.split(',').map(Number)
        return linha === r && col === c
      })
      if(!exists) emptyCells.push([r,c])
    }
  }
  if(emptyCells.length === 0) return
  const [row,col] = emptyCells[Math.floor(Math.random()*emptyCells.length)]
  const newId = mesas.value.length ? Math.max(...mesas.value.map(m=>m.id))+1 : 1
  const newMesa = { id: newId, status: 1, localizacao: `${row},${col}` }

  // Insere no Supabase
  const { data, error } = await supabase
      .from('mesa')
      .insert([newMesa])
  if(error) console.error(error)
  else mesas.value.push(data[0])
}

// Carrega mesas ao montar
onMounted(fetchMesas)

const getCellClass = (cell) => {
  switch(cell.type) {
    case 'table':
      if(cell.status === 'Livre') return 'bg-light-blue'
      if(cell.status === 'Ocupada') return 'bg-orange'
      if(cell.status === 'Reservada') return 'bg-green'
      return ''
    case 'wall': return 'bg-grey'
    default: return ''
  }
}
</script>

<style scoped>
.bg-light-blue { background-color: #90caf9; }
.bg-orange { background-color: #ffb74d; }
.bg-green { background-color: #81c784; }
.bg-grey { background-color: #b0bec5; }
</style>
