<template>
  <v-btn size="small" icon="mdi-reload" v-if="props.permissoes?.list" @click="$emit('reload')"/>
  <v-btn density="default" variant="elevated" v-if="props.permissoes?.create" @click="$emit('create')">
    Nov{{props.suf}} {{props.tela}}
    <v-icon icon="mdi-plus"></v-icon>
  </v-btn>
</template>
<script setup lang="ts">
const emit = defineEmits(["reload", "create"]);
const props = defineProps<{
  permissoes?: {
    create?: boolean,
    list?: boolean,
  }
  tela: string
  suf: string
}>()
</script>