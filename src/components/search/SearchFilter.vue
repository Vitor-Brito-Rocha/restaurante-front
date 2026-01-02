<template>
  <v-card flat class="bg-transparent ga-4 py-1 px-3 d-flex align-center" style="min-height: 10vh;">

    <v-autocomplete
        v-if="!isMobile()"
        v-model="selectedFilter"
        :items="props.filters"
        item-title="descricao"
        item-value="id"
        placeholder="Filtros"
        prepend-inner-icon="mdi-filter-variant"
        style="max-width: 200px;"
        hide-details
        variant="outlined"
        density="comfortable"
    ></v-autocomplete>

    <v-text-field
        v-model="searchValue"
        label="Pesquisa"
        hide-details
        variant="outlined"
        density="comfortable"
        class="flex-grow-1"
        @keydown.enter="$emit('searchEvent', model)"
    >
      <template #append-inner>
        <v-icon
            icon="mdi-magnify"
            :color="searchValue.length > 0 ? 'primary' : 'grey'"
            @click="$emit('searchEvent', model)"
        ></v-icon>
      </template>
    </v-text-field>
  </v-card>
  <v-btn
      v-if="isMobile()"
      density="default"
      variant="elevated"
      icon="mdi-filter-variant"
      class="downButtonLeft"
      @click="sheet = true"
  ></v-btn>

  <v-bottom-sheet content-class="shadow-none" class="bg-transparent shadow-none border-0" v-model="sheet">
    <v-card
        @touchstart="handleSheetTouchStart"
        @touchmove="handleSheetTouchMove"
        @touchend="handleSheetTouchEnd"
        :style="{
      transform: `translateY(${sheetOffset}px)`,
      transition: isDraggingSheet ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)'
    }"
        class="rounded-t-xl pb-6 shadow-none border-0"
    >
      <div class="d-flex barraArrastar justify-center pa-4 cursor-pointer">
        <div
            style="width: 40px; height: 5px; background: rgba(0,0,0,0.2); border-radius: 10px;"
        ></div>
      </div>
      <v-card-title class="text-center font-weight-bold">Filtrar por</v-card-title>

      <v-list class="pa-2">
        <v-list-item
            v-for="filter in props.filters"
            :key="filter.id"
            :active="selectedFilter === filter.id"
            variant="tonal"
            class="mb-2 rounded-lg"
            @click="selectFilter(filter.id)"
        >
          <template v-slot:prepend>
            <v-icon :icon="selectedFilter === filter.id ? 'mdi-check-circle' : 'mdi-circle-outline'"></v-icon>
          </template>
          <v-list-item-title>{{ filter.descricao }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { isMobile } from "@/services/system/system.service.ts";

const emit = defineEmits(['searchEvent', 'reloadTable']);
const props = defineProps({
  filters: Array<any>,
});

const sheet = ref(false);
const selectedFilter = ref(null);
const searchValue = ref("");
const model = { type: selectedFilter, value: searchValue };

const selectFilter = (id: any) => {
  selectedFilter.value = id;
  setTimeout(async () => {
    sheet.value = false;
  }, 300);
};
const sheetOffset = ref(0); // Deslocamento em pixels
const isDraggingSheet = ref(false);
let startY = 0;

function handleSheetTouchStart(e: TouchEvent) {
  startY = e.touches[0].clientY;
  isDraggingSheet.value = true;
}

function handleSheetTouchMove(e: TouchEvent) {
  const currentY = e.touches[0].clientY;
  const deltaY = currentY - startY;

  // Só permite arrastar para baixo (positivo)
  if (deltaY > 0) {
    sheetOffset.value = deltaY;
  }
  if(deltaY > 180){
    sheet.value = false
  }
}

function handleSheetTouchEnd() {
  isDraggingSheet.value = false;
  // Se arrastou mais de 100px para baixo, fecha o sheet
  if (sheetOffset.value > 100) {
    sheet.value = false;
  }
  // Reseta o offset (se não fechou, ele volta pro lugar via transição CSS)
  sheetOffset.value = 0;
}
</script>
<style scoped>
.barraArrastar{
  touch-action: none
}
/* Remove a sombra do container fixo do Vuetify */
</style>