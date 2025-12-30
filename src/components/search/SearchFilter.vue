<template>
    <v-card style="min-height: 10vh; max-height: 10vh;" flat class="bg-transparent ga-4 py-1 px-3 d-flex align-center">

        <v-autocomplete
            v-model="selectedFilter"
            :items="filters"
            item-title="descricao"
            item-value="id"
            :placeholder="isMobile() ? '' : 'Filtros'"
            prepend-inner-icon="mdi-filter-variant"
            :style="isMobile() ? 'max-width: 80px;' : 'max-width: 200px;'"
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
                style="cursor: pointer"
            ></v-icon>
          </template>
        </v-text-field>

    </v-card>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {SearchFilterType} from "@/models/SearchFilter.ts";
import {isMobile} from "@/services/system/system.service.ts";
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