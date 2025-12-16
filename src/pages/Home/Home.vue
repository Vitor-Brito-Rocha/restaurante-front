<template>
  <v-container fluid class="pa-6 dashboard-root">
    <!-- HEADER -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold">Bem-vindo 👋</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Acompanhe o andamento do restaurante em tempo real
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
        <v-chip variant="outlined" size="large" class="text-capitalize date-chip">
          {{ today }}
        </v-chip>
      </v-col>
    </v-row>

    <!-- KPI CARDS (SEM DADOS SENSÍVEIS) -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="border " rounded="xl" elevation="0">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption text-medium-emphasis">Pedidos ativos</p>
                <h2 class="font-weight-bold">14</h2>
              </div>
              <v-icon size="36" color="primary">mdi-receipt-text-clock</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="border" rounded="xl" elevation="0">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption text-medium-emphasis">Mesas ocupadas</p>
                <h2 class="font-weight-bold">12</h2>
              </div>
              <v-icon size="36" color="secondary">mdi-table-chair</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="border" rounded="xl" elevation="0">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption text-medium-emphasis">Pedidos na cozinha</p>
                <h2 class="font-weight-bold">6</h2>
              </div>
              <v-icon size="36" color="secondary">mdi-silverware-fork-knife</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="border" rounded="xl" elevation="0">
          <v-card-text>
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-caption text-medium-emphasis">Prontos para servir</p>
                <h2 class="font-weight-bold">3</h2>
              </div>
              <v-icon size="36" color="success">mdi-check-circle</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- MAIN CONTENT -->
    <v-row>
      <!-- STATUS GERAL -->
      <v-col cols="12" md="8">
        <v-card class="section-card border" rounded="xl" elevation="0">
          <v-card-title class="font-weight-bold mt-2 align-middle justify-center items-center">Status recente</v-card-title>
          <v-divider class="my-2" />
          <v-list density="comfortable">
            <v-list-item v-for="item in feed" :key="item.id">
              <template #prepend>
                <v-icon :color="item.color">{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.time }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- AÇÕES RÁPIDAS -->
      <v-col cols="12" md="4">
        <v-card class="section-card border" rounded="xl" elevation="0">
          <v-card-title class="font-weight-bold mt-2 align-middle justify-center items-center">Ações rápidas</v-card-title>
          <v-divider class="my-2" />
          <v-card-text class="d-flex flex-column gap-3">
            <v-btn color="primary" block prepend-icon="mdi-plus-box">Novo pedido</v-btn>
            <v-btn color="secondary" block prepend-icon="mdi-table-chair">Mesas</v-btn>
            <v-btn color="success" block prepend-icon="mdi-silverware">Pedidos</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const today = computed(() =>
    new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    })
)

const feed = [
  { id: 1, title: 'Mesa 5 fez um novo pedido', time: 'há 2 min', icon: 'mdi-food', color: 'primary' },
  { id: 2, title: 'Pedido da mesa 2 ficou pronto', time: 'há 6 min', icon: 'mdi-check-circle', color: 'success' },
  { id: 3, title: 'Mesa 8 solicitou atendimento', time: 'há 10 min', icon: 'mdi-bell-ring', color: 'warning' },
]
</script>

<style scoped>
.dashboard-root {
  background: linear-gradient(180deg, rgba(25,118,210,0.05), transparent);
}

.section-card {
  backdrop-filter: blur(6px);
}

.date-chip {
  border-width: 2px;
}

.gap-3 {
  gap: 12px;
}
</style>