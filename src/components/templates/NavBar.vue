<template>
  <v-app-bar style="display: flex !important;" class="px-10 w-100 align-center" color="secondary">
      <span class="text-h5">Olá,&nbsp;</span>
      <span class="text-h5" style="text-decoration: underline;">{{ nome.split(' ')[0] }}</span>
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
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import {getNomeUsuario, logout} from "@/services/auth/auth.service.ts";
const nome: string = getNomeUsuario()
const theme = useTheme()
const isDark = ref(false)
// Computed para texto e ícone
// const iconName = computed(() => (isDark.value ? 'mdi-moon-waxing-crescent' : 'mdi-white-balance-sunny'))

const toggleTheme = () => {
  isDark.value = !isDark.value
  theme.change( isDark.value ? 'theme_restaurant_dark' : 'theme_restaurant_light')
}

</script>