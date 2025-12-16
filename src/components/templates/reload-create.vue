<template>
  <v-btn size="small" icon="mdi-reload" @click="$emit('reload')"/>
  <v-btn density="default" variant="elevated" @click="$emit('create')">
    Nov{{props.suf}} {{props.tela}}
    <v-icon icon="mdi-plus"></v-icon>
  </v-btn>
</template>
<script setup lang="ts">
const emit = defineEmits(["reload", "create"]);
const props = defineProps({
  tela: String,
  suf: String,
})
</script>