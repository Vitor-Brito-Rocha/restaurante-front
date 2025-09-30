<template>
  <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      rail-width="60"
      permanent
      style="border-radius: 1dvw;"
      class="border border-2 ml-9 mt-auto mb-auto h-75 d-flex"
  >
    <v-list density="compact" nav>
      <!-- Loop pelos itens -->
      <template v-for="(item, i) in items" :key="i">
        <!-- Se o item tiver filhos, vira um grupo -->
        <v-list-group
            v-if="item.children"
            :value="item.title"
            :prepend-icon="item.icon"
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.title"></v-list-item>
          </template>

          <!-- Renderiza os filhos -->
          <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :prepend-icon="child.icon"
              :to="child.route"
              class="pl-0"
              :title="child.title"
          />
        </v-list-group>

        <!-- Caso contrário, vira só um item -->
        <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.route"

        />
      </template>
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
const items = [
  {
    icon: 'mdi-home',
    title: 'Início',
    route: 'restaurante'
  },
  {
    icon: 'mdi-folder',
    title: 'Projetos',
    children: [
      { icon: 'mdi-file-outline', title: 'Projeto A',  route: 'projA' },
      { icon: 'mdi-file-outline', title: 'Projeto B', route: 'projB' },
    ]
  },
  {
    icon: 'mdi-cog',
    title: 'Configurações',
    route: 'config'
  },
  {
    icon: 'mdi-logout',
    title: 'Logout',
    route: 'logout'

  }
]
const drawer = ref(true)
const rail = ref(true)
</script>
<style scoped>
.toggle-btn {
  position: absolute;
  top: 0;        /* distância do topo do drawer */
  right: -40px;     /* posição fora do drawer, flutuando */
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
.v-list-group__items .v-list-item {
  padding-inline-start: 8px !important;
}

</style>