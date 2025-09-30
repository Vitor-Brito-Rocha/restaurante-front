<template>
  <v-app class="app" >
  <NavBar v-if="showNavBar" />
  <div class="h-100">
    <LateralBar v-if="showLatBar"/>
  <RouterView />
  </div>
    <AppSnackbar v-if="showLatBar" />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppSnackbar from '@/components/templates/AppSnackbar.vue'
const route = useRoute();
const showLatBar = computed(() => !route.meta.hideLatBar);
const showNavBar = computed(() => !route.meta.hideNavBar);
import { computed  } from 'vue'
import LateralBar from "@/components/templates/LateralBar.vue";
import NavBar from "@/components/templates/NavBar.vue";
// Computed para texto e ícone
</script>
