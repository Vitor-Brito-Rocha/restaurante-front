<template>
  <v-snackbar
      v-model="store.show"
      :color="store.snackbarColor"
      :timeout="store.timeout"
      :location="!isMobile() ? 'bottom center' : 'top center'"
  >
    <span v-html="store.message" />
    <template #actions>
      <v-btn
          variant="text"
          class="text-white"
          @click="store.show = false"
      >
        OK
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/stores/snackbar'
import {isMobile} from "@/services/system/system.service.ts";

const store = useSnackbarStore()
</script>
