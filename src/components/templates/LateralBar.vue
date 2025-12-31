<template>
  <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      rail-width="60"
      permanent
      style="border-radius: 1dvw;"
      class="border border-1 ml-4 mt-15 h-75 d-flex"
  >
    <v-list
        v-model:opened="openedGroups"
        density="compact" nav>
      <!-- Loop pelos itens -->
      <template v-for="(item, i) in items" :key="i">
        <v-list-group
            fluid
            v-if="item.children?.length > 0"
            :value="item.titulo"
            :prepend-icon="item.icone"
            color="primary"
        >
          <template #activator="{ props }">
            <v-list-item
                v-bind="props"
                :title="item.titulo"
                class="font-weight-bold"
            ></v-list-item>
          </template>

          <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              base-color="gray_test"
              :prepend-icon="child.icone"
              :to="child.rota"
              :title="child.titulo"
              class="child-item"
              active-class="bg-primary-lighten-5 primary--text"
          >
            <template v-slot:prepend>
              <v-icon :icon="child.icone"></v-icon>
            </template>
          </v-list-item>
        </v-list-group>

        <!-- Caso contrário, vira só um item -->
        <v-list-item
            v-else
            :prepend-icon="item.icone"
            :title="item.titulo"
            :to="item.rota"
            class="child-item"
            active-class="bg-primary-lighten-5 primary--text"
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
import {ref, onMounted, onBeforeMount, watch} from 'vue'
import {getRotasMenu} from "@/services/menu/lateralMenu.service.ts";
const items = ref<any[]>([
  { titulo: "Início", rota: "inicio", icone: "mdi-home", children: [] }
])
const openedGroups = ref<string[]>([])
const openedBackup = ref<string[]>([])
const rail = ref(true)
const isExpandingFromGroup = ref(false)
watch(rail, (isRail) => {
  if (isExpandingFromGroup.value) {
    // foi expansão provocada por clique no group → não mexe nos groups
    isExpandingFromGroup.value = false
    return
  }

  if (isRail) {
    openedBackup.value = [...openedGroups.value]
    openedGroups.value = []
  } else {
    openedGroups.value = [...openedBackup.value]
  }
})
watch(openedGroups, (val) => {
  if (rail.value && val.length > 0) {
    isExpandingFromGroup.value = true
    rail.value = false
  }
})

onBeforeMount(async () => {
  const savedMenu = localStorage.getItem('menu')

  if (savedMenu) {
    const parsed = JSON.parse(savedMenu)

    items.value.push(
        ...parsed.sort((a: any, b: any) =>
            a.titulo.localeCompare(b.titulo)
        )
    )

  } else {
    const menuFromApi = await getRotasMenu()

    const sortedMenu = menuFromApi.sort((a: any, b: any) =>
        a.titulo.localeCompare(b.titulo)
    )

    items.value.push(...sortedMenu)
    localStorage.setItem('menu', JSON.stringify(sortedMenu))
  }
})

const drawer = ref(true)
</script>
<style scoped>
.toggle-btn {
  position: absolute;
  top: 0;        /* distância do topo do drawer */
  right: -40px;     /* posição fora do drawer, flutuando */
  z-index: 10;
  transition: transform 0.3s ease;
}

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
:deep(.v-list-item) {
  margin-bottom: 4px !important;
  border-radius: 8px !important; /* Arredondado igual para todos */
  transition: all 0.2s ease;
  position: relative !important;
}

:deep(.v-list-item--active) {
  font-weight: 600 !important;
  background-color: (90deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-primary), 0.02) 100%) !important;
}
:deep(.v-list-group__items){
  background: rgba(128, 128, 128, 0.13) !important;
  border-radius: 8px 8px !important;
}
:deep(.v-list-item--active::before) {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 60%;
  width: 4px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 0 4px 4px 0;
  z-index: 2;
}

:deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) .v-list-group__items .v-list-item {
  padding-inline-start: 20px !important; /* Recuo interno para o ícone */
  margin-left: 8px !important; /* Pequeno recuo para hierarquia */
  width: calc(100% - 8px) !important;
  border-left: none !important; /* Removemos a linha fina antiga */
}

:deep(.v-navigation-drawer--rail) .v-list-item {
  margin-left: 0 !important;
  padding-inline-start: 8px !important;
}

:deep(.v-list-group__items .v-list-item-title) {
  font-size: 0.875rem !important;
}
</style>