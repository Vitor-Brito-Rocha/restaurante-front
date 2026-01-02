<template>
  <v-card>
    <v-card-title class="d-flex justify-space-around align-center w-100">
        {{dados ? 'Editar Cliente: '+ dados.nome.toUpperCase()  : 'Cadastrar Cliente'}}
        <v-btn icon="mdi-close" color="primary" @click="$emit('close')"></v-btn>
    </v-card-title>
    <v-card-text>

    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {Cliente} from "@/models/Cliente.ts";
const dados = ref<Cliente | null>(null);
const props = defineProps<{
  dados?: Cliente;
}>()
onMounted(() => {
  if(props.dados){
  dados.value = props.dados;
  }
})
</script>
<style scoped>

</style>