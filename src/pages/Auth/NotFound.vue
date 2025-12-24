<script setup lang="ts">
import {logout} from "@/services/auth/auth.service.ts";
</script>

<template>
  <v-container
      class="d-flex flex-column align-center justify-center text-center"
      style="height: 100vh;"
  >
    <v-card
        class="pa-10"
        elevation="8"
        width="450"
    >
      <v-icon
          size="95"
          class="mb-5"
          color="primary"
      >
        mdi-alert-circle-outline
      </v-icon>

      <h1 class="text-h4 font-weight-bold mb-2">
        Página Não Encontrada
      </h1>

      <p class="text-body-1 mb-6">
        A página que você procura não existe ou foi movida.
      </p>

      <v-btn
          color="primary"
          size="large"
          @click="logout()"
      >
        Voltar ao Login
      </v-btn>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Ajuste opcional */

</style>
