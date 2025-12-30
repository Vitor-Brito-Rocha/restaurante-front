<template>
  <v-app class="app">
    <RouterView v-if="route.name == 'Login' || route.name == 'Register' || route.name == 'NotFound'" />
    <RouterView v-else class="flex-shrink-0" v-slot="{ Component }">

      <NavBar v-if="showNavBar" />

      <LateralBar v-if="showLatBar && !mobile" class="flex-shrink-0" />

      <v-main v-if="!mobile" class="mt-15 d-flex align-center">
        <div class="w-100 mr-2 ml-15 h-100">
          <component :is="Component" />
        </div>
      </v-main>
      <v-main v-else class="d-flex mt-7 justify-center align-content-center align-center">
        <div class="w-100 justify-center d-flex align-center align-content-center h-100">
          <component :is="Component" />
        </div>
      </v-main>

    </RouterView>
    <AppSnackbar />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppSnackbar from '@/components/templates/AppSnackbar.vue'
const route = useRoute();
const showLatBar = computed(() => !route.meta.hideLatBar);
const showNavBar = computed(() => !route.meta.hideNavBar);
import {computed, onMounted, ref} from 'vue'
import LateralBar from "@/components/templates/LateralBar.vue";
import NavBar from "@/components/templates/NavBar.vue";
import {onItemPronto} from "@/services/system/socket.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {isMobile} from "@/services/system/system.service.ts";
const snackbar = useSnackbarStore()
const mobile = computed(()=> isMobile())
const isVisible = ref<boolean>(true)
onMounted(() => {
  document.addEventListener("visibilitychange", () => {
    isVisible.value = document.visibilityState == "visible"
  })
    window.addEventListener("online", () => {
      snackbar.trigger("Você está online!", "success")
    });
    window.addEventListener("offline", () => {
      console.log('desconectado')
      snackbar.trigger("Você está offline, verifique sua conexão com a internet!", "error")
    });
  onItemPronto(data => {
    if (isVisible.value) {
      snackbar.trigger(
          `Item #${data.itemId} - ${data.produto} da mesa #${data.mesa} está pronto`, 'success', 10000
      )
    }
  })
})

</script>
<style scoped>
</style>