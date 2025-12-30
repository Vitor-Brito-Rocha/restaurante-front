<template>
  <v-btn size="small" icon="mdi-reload" v-if="props.permissoes?.list && !isMobile()" @click="$emit('reload')"/>
  <v-btn density="default" variant="elevated" v-if="props.permissoes?.create && !isMobile()" @click="$emit('create')">
    Nov{{props.suf}} {{props.tela}}
    <v-icon icon="mdi-plus"></v-icon>
  </v-btn>
  <v-btn icon density="default" variant="elevated" color="success" class="downButton" v-if="props.permissoes?.create && isMobile()" @click="$emit('create')">
    <v-icon icon="mdi-plus"></v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import {isMobile} from "@/services/system/system.service.ts";

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
<style scoped>
.downButton{
  right: 20px;
  bottom: 20px;
  position: fixed;
  z-index: 1003;

}</style>