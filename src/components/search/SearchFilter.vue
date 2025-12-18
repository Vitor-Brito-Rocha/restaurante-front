<template>
    <v-card style="min-height: 10vh; max-height: 10vh;" class="shadow ga-4 px-3 d-flex align-center">
  <v-autocomplete placeholder="Filtros" :items="filters" v-model="selectedFilter" item-title="descricao" item-value="id"  style="max-width: 20vw;" hide-details variant="outlined"></v-autocomplete>
<v-text-field @keydown.enter="() => {$emit('searchEvent', model)}" v-model="searchValue" label="Pesquisa" hide-details variant="outlined"></v-text-field>
    <v-btn :disabled="searchValue.length < 1 || !selectedFilter" @click="() => {$emit('searchEvent', model)}" icon>
      <v-icon icon="mdi-magnify"></v-icon>
    </v-btn>
    <v-btn @click="() => {searchValue = ''; $emit('reloadTable')}" icon>
      <v-icon icon="mdi-close" v-if="searchValue.length>1"></v-icon>
      <v-icon icon="mdi-reload" v-else></v-icon>
    </v-btn>
    </v-card>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {SearchFilterType} from "@/models/SearchFilter.ts";
const emit = defineEmits(['searchEvent', 'reloadTable']);
const props = defineProps({
  filters: Array,
});
const filters = props.filters;
const selectedFilter = ref<SearchFilterType | null>(null);
const searchValue = ref<string>("")
const model = {type: selectedFilter, value: searchValue};
</script>
<style scoped>

</style>