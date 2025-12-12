<template>
  <v-app-bar style="display: flex !important;" class="px-9 w-100 align-center h-10" color="secondary">
    <v-icon icon="mdi-account-circle" size="large"></v-icon> &nbsp;
    <span class="text-h6">Olá,&nbsp;</span>
      <span class="text-h6" style="text-decoration: underline;">{{ nome.split(' ')[0] }}</span>
      <span class="text-h5">!</span>
  <v-spacer></v-spacer>
  <v-btn
      @click="toggleTheme"
      color="primary"
      :icon="isDark ? 'mdi-moon-waxing-crescent' : 'mdi-white-balance-sunny'"
      elevation="3"
      class="mr-4"
  />
    <v-btn
        @click="logout"
        color="primary"
        icon="mdi-logout"
        elevation="3"
    />
  </v-app-bar>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import { useTheme } from 'vuetify'
import {getNomeUsuario, logout} from "@/services/auth/auth.service.ts";
const nome: string = getNomeUsuario()
const theme = useTheme()
const isDark = ref(localStorage.getItem('theme') === 'dark')

// Aplica o tema ao montar
onBeforeMount(() => {
  theme.change(isDark.value ? 'theme_restaurant_dark' : 'theme_restaurant_light')
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  const themeName = isDark.value ? 'theme_restaurant_dark' : 'theme_restaurant_light'
  theme.change(themeName)

  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

</script>