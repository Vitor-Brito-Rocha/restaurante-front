<template>
  <v-app class="app" >
  <NavBar v-if="showNavBar" />
      <LateralBar v-if="showLatBar" class="flex-shrink-0" />
    <RouterView v-if="route.name == 'Login' || route.name == 'Register'" />
    <v-main v-else class=" mt-3 d-flex align-center"> <!-- align-center para alinhar verticalmente -->

        <div class="w-100 mr-2 ml-15 h-100">
          <RouterView  />
        </div>
    </v-main>
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
<style scoped>
</style>