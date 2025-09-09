<template>
  <v-snackbar
      v-model="store.show"
      :color="store.snackbarColor"
      :timeout="store.timeout"
      location="bottom center"
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

const store = useSnackbarStore()
</script>
