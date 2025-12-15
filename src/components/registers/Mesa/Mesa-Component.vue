<template>
  <v-card>
    <v-card-title class="d-flex justify-space-around align-center w-100">
        {{dados?.id ? 'Editar Mesa ('+ dados.id +')'  : 'Cadastrar Mesa'}}
        <v-btn icon="mdi-close" color="primary" @click="$emit('close')"></v-btn>
    </v-card-title>
    <v-card-text>

    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {Mesa} from "@/models/Mesa.ts";
const dados = ref<Mesa | null>(null);
const props = defineProps<{
  dados?: Mesa;
}>()
onMounted(() => {
  if(props.dados){
  dados.value = props.dados;
  }
})
</script>
<style scoped>

</style>