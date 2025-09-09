<template>
  <v-app class="w-100 h-100" >
  <NavBar v-if="showNavBar" />
  <div>
    <LateralBar v-if="showLatBar"/>
  <RouterView />
  </div>
    <AppSnackbar />
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
