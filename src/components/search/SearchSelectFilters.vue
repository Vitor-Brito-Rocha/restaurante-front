<template> <div class="w-100 ga-5 px-4 d-flex justify-space-evenly align-center items-center align-content-center"> <v-autocomplete density="default" v-for="item in localData" :label="item.label" v-model="item.value" item-value="id" item-title="descricao" maxWidth="400" :items="item.items" variant="outlined" @update:modelValue="val => onChange(item.key, val)"></v-autocomplete> </div></template>

<script setup lang="ts">
import type { FilterSelect } from "@/models/FilterSelect.ts"
import type {PadraoManyFilters} from "@/models/PadraoManyFilters.ts";
import {ref} from "vue";
const props = defineProps<{
  data: FilterSelect[]
}>()
const emit = defineEmits<{
  (e: "update", value: PadraoManyFilters): void
}>()

const localData = ref<FilterSelect[] | null>(props.data);
function onChange(key: string, value: any) {
  const updatedFilters: PadraoManyFilters = localData.value!.map(item => ({
    type: item.key,
    value: item.key === key ? value : item.value
  }))

  emit("update", updatedFilters)
}
</script>
