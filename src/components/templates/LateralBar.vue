<template>
  <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      rail-width="60"
      permanent
      style="border-radius: 1dvw;"
      class="border border-1 ml-4 mt-15 h-75 d-flex"
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
import {ref, onMounted} from 'vue'
import {getRotasMenu} from "@/services/menu/lateralMenu.service.ts";
const items = ref<any[]>([]);
onMounted(async ()=>{
  const savedMenu = localStorage.getItem('menu');
  if (savedMenu) {
    items.value = JSON.parse(savedMenu);
  } else {
    const menuFromApi = await getRotasMenu();
    items.value = menuFromApi;
    localStorage.setItem('menu', JSON.stringify(menuFromApi));
  }
})
// const items = [
//   {
//     icon: 'mdi-home',
//     title: 'Início',
//     route: 'restaurante'
//   },
//   {
//     icon: 'mdi-folder',
//     title: 'Projetos',
//     children: [
//       { icon: 'mdi-file-outline', title: 'Projeto A',  route: 'projA' },
//       { icon: 'mdi-file-outline', title: 'Projeto B', route: 'projB' },
//     ]
//   },
//   {
//     icon: 'mdi-cog',
//     title: 'Configurações',
//     route: 'configuracoes'
//   },
//   {
//     icon: 'mdi-logout',
//     title: 'Logout',
//     route: 'logout'
//
//   }
// ]
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