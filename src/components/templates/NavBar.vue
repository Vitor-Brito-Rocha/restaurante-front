<template>
  <v-app-bar style="display: flex !important;" :class="!mobile ? 'px-9 w-100 align-center h-10' : 'px-2 w-100 align-center h-10'" color="secondary">
    <v-btn class="mr-2" v-if="mobile" icon @click="menuOpened = !menuOpened" ><v-icon>mdi-menu</v-icon></v-btn>
    <v-icon icon="mdi-account-circle" size="large"></v-icon> &nbsp;
    <span class="text-h6">Olá,&nbsp;</span>
      <span class="text-h6" style="text-decoration: underline;">{{ nome.split(' ')[0] }}</span>
      <span class="text-h5">!</span>
  <v-spacer></v-spacer>
  <v-btn
      @click="toggleTheme"
      :icon="isDark ? 'mdi-moon-waxing-crescent' : 'mdi-white-balance-sunny'"
      class="mr-4 ml-4"
  />
    <v-btn
        @click="logout"
        icon="mdi-logout"
    />
  </v-app-bar>
  <v-navigation-drawer temporary v-model="menuOpened">
  <v-list density="compact" v-if="mobile && menuOpened" nav>
    <!-- Loop pelos itens -->
    <template v-for="(item, i) in items" :key="i">
      <!-- Se o item tiver filhos, vira um grupo -->
      <v-list-group
          v-if="item.children?.length > 0"
          :value="item.titulo"
          :prepend-icon="item.icone"
      >
        <template #activator="{ props }">
          <v-list-item v-bind="props" :title="item.titulo"></v-list-item>
        </template>

        <!-- Renderiza os filhos -->
        <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            :prepend-icon="child.icone"
            :to="child.rota"
            :title="child.titulo"
            @click="menuOpened = false"

        />
      </v-list-group>

      <!-- Caso contrário, vira só um item -->
      <v-list-item
          v-else
          :prepend-icon="item.icone"
          :title="item.titulo"
          :to="item.rota"
          @click="menuOpened = false"

      />
    </template>
  </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import { useTheme } from 'vuetify'
import {getNomeUsuario, logout} from "@/services/auth/auth.service.ts";
import {isMobile} from "@/services/system/system.service.ts";
import {getRotasMenu} from "@/services/menu/lateralMenu.service.ts";
const nome: string = getNomeUsuario()
const theme = useTheme()
const menuOpened = ref(false)
import { computed } from 'vue'

const mobile = computed(() => isMobile())

const isDark = ref(localStorage.getItem('theme') === 'dark')

  const items = ref<any[]>([
    { titulo: "Início", rota: "inicio", icone: "mdi-home", children: [] }
  ])
// Aplica o tema ao montar
async function loadMenu() {
  const savedMenu = localStorage.getItem('menu')

  let menu: any[]

  if (savedMenu) {
    menu = JSON.parse(savedMenu)
  } else {
    menu = await getRotasMenu()
    localStorage.setItem('menu', JSON.stringify(menu))
  }

  menu.sort((a, b) => a.titulo.localeCompare(b.titulo))
  items.value.push(...menu)
}
onBeforeMount(async () => {
  theme.change(isDark.value ? 'theme_restaurant_dark' : 'theme_restaurant_light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

  if (mobile.value) {
    await loadMenu()
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  const themeName = isDark.value ? 'theme_restaurant_dark' : 'theme_restaurant_light'
  theme.change(themeName)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

}

</script>
<style scoped>
.v-list-group__items .v-list-item {
  padding-inline-start: 8px !important;
}
</style>