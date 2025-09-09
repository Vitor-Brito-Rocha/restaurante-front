<template>
  <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      rail-width="60"
      permanent
      style="border-radius: 1dvw;"
      class="border border-2 ml-9 mt-auto mb-auto h-75 d-flex"
  >
    <v-list v-for="item in items">

      <v-list-item :prepend-icon="item.icon" :title="item.title"></v-list-item>
    </v-list>

    <!-- Botão que fica visível mesmo no rail -->
    <v-btn
        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        variant="plain"

        :ripple="false"
        class="toggle-btn"
        @click.stop="rail = !rail"
    ></v-btn>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const items = [ {
  icon: 'mdi-logout',
  title: 'Logout'
},
  {
    icon: 'mdi-check',
    title: 'Check',
  }]
const drawer = ref(true)
const rail = ref(true)
</script>
<style scoped>
.toggle-btn {
  position: absolute;
  top: 10px;        /* distância do topo do drawer */
  right: -20px;     /* posição fora do drawer, flutuando */
  z-index: 10;
  transition: transform 0.3s ease;
}

/* Animação opcional para girar o ícone ao mudar de estado */
.toggle-btn .v-icon {
  transition: transform 0.3s ease;
}
.toggle-btn .v-icon.mdi-chevron-left {
  transform: rotate(0deg);
}
.toggle-btn .v-icon.mdi-chevron-right {
  transform: rotate(180deg);
}
</style>