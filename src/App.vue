<template>
  <v-app class="app" >
    <RouterView v-if="route.name == 'Login' || route.name == 'Register' || route.name == 'NotFound'" />
    <RouterView v-else class="flex-shrink-0" v-slot="{ Component }">

      <NavBar v-if="showNavBar" />

      <LateralBar v-if="showLatBar" class="flex-shrink-0" />

      <v-main class="mt-15 d-flex align-center">
        <div class="w-100 mr-2 ml-15 h-100">
          <component :is="Component" />
        </div>
      </v-main>

    </RouterView>
    <AppSnackbar v-if="showLatBar" />
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
const snackbar = useSnackbarStore()
const isVisible = ref<boolean>(true)
onMounted(() => {
  document.addEventListener("visibilitychange", () => {
    console.log(document.visibilityState)
    isVisible.value = document.visibilityState == "visible"
  })
console.log(document.visibilityState, " Documento")
console.log(isVisible.value)
  onItemPronto(data => {
    if (isVisible.value) {
      console.log(data, 'bateu')
      snackbar.trigger(
          `Item #${data.itemId} (${data.produto}) da mesa #${data.mesa} está pronto`, 'success'
      )
    }
  })
})

</script>
<style scoped>
</style>