<template>
  <v-card style="min-height: 12vh; max-height: 12vh;" class="shadow ga-4 px-3 d-flex justify-content-around align-center">
    <v-text-field @keydown.enter="() => {$emit('searchEvent', model)}" v-model="searchValue" label="Pesquisa" hide-details variant="outlined">
      <template v-if="props?.pesquisa" #label>
        Pesquisar por {{props?.pesquisa}}
      </template>
    </v-text-field>
    <v-btn :disabled="searchValue.length < 1" @click="() => {$emit('searchEvent', model)}" icon>
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
const props = defineProps({
  pesquisa: String,
  coluna: String,
});
const searchValue = ref<string>("")
const model = {type: props?.coluna, value: searchValue};
</script>
<style scoped>

</style>