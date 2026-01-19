<!-- MenuView.vue -->
<template>
  <v-container fluid class="pa-6">
    <!-- HEADER -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold">Nosso Cardápio 🍽️</h1>
      </v-col>
      <v-col cols="12" md="4" class="d-flex justify-end align-center">
        <v-btn
            color="primary"
            prepend-icon="mdi-refresh"
            @click="carregarMenu"
            :loading="loading"
        >
          Atualizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- LOADING -->
    <v-row v-if="loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular
            indeterminate
            color="primary"
            size="64"
        />
      </v-col>
    </v-row>

    <!-- TABS DE CATEGORIAS -->
    <div v-else>
      <v-card v-if="categoriasOrdenadas.length > 0" class="border" rounded="xl" elevation="0">
        <v-tabs
            v-model="tabAtiva"
            align-tabs="center"
            show-arrows
        >
          <v-tab
              v-for="categoria in categoriasOrdenadas"
              :key="categoria.id"
              :value="categoria.id"
          >
            {{ categoria.descricao || 'Sem categoria' }}
            <v-chip
                size="x-small"
                class="ml-2"
                variant="tonal"
            >
              {{ getProdutosPorCategoria(categoria.id).length }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-tabs-window v-model="tabAtiva">
          <v-tabs-window-item
              v-for="categoria in categoriasOrdenadas"
              :key="categoria.id"
              :value="categoria.id"
          >
            <v-card-text class="pa-6">
              <v-row v-if="getProdutosPorCategoria(categoria.id).length > 0">
                <v-col
                    v-for="produto in getProdutosPorCategoria(categoria.id)"
                    :key="produto.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                >
                  <ProdutoCard :produto="produto" />
                </v-col>
              </v-row>

              <!-- CATEGORIA VAZIA -->
              <div v-else class="text-center py-12">
                <v-icon size="64" color="grey-lighten-1">mdi-food-off</v-icon>
                <p class="text-h6 text-medium-emphasis mt-4">
                  Nenhum produto disponível nesta categoria
                </p>
              </div>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>

      <!-- MENSAGEM VAZIA GERAL -->
      <v-row v-else>
        <v-col cols="12">
          <v-card class="border" rounded="xl" elevation="0">
            <v-card-text class="text-center py-12">
              <v-icon size="64" color="grey-lighten-1">mdi-food-off</v-icon>
              <p class="text-h6 text-medium-emphasis mt-4">
                Nenhum produto disponível no momento
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getMenu } from '@/services/menu.service.ts'
import { useSnackbarStore } from '@/stores/snackbar'
import ProdutoCard from './Dish-Component.vue'
import { verifyError } from '@/services/system/system.service'
import type { Produto } from '@/models/Registros/Produto.ts'
import type { Categoria } from '@/models/Tipos/Categoria.ts'

const snackbar = useSnackbarStore()
const loading = ref<boolean>(false)
const produtos = ref<Produto[]>([])
const categorias = ref<Categoria[]>([])
const totalItems = ref<number>(0)
const tabAtiva = ref<number | undefined>(undefined)

// Categorias ordenadas
const categoriasOrdenadas = computed(() => {
  return [...categorias.value]?.sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
})

// Produtos por categoria
const produtosPorCategoria = computed(() => {
  const grupos: Record<number, Produto[]> = {}

  produtos.value.forEach(produto => {
    const catId = produto.categoria_id || 0
    if (!grupos[catId]) {
      grupos[catId] = []
    }
    grupos[catId].push(produto)
  })

  return grupos
})

function getProdutosPorCategoria(categoriaId?: number): Produto[] {
  const catId = categoriaId || 0
  const prods = produtosPorCategoria.value[catId] || []

  // Filtra apenas ativos e ordena
  return prods
      .filter(p => p.ativo !== false)
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
}

async function carregarMenu() {
  loading.value = true

  try {
    const { menu, categorias: cats, message } = await getMenu()
    produtos.value = menu
    categorias.value = cats

    // Define a primeira categoria como ativa
    if (cats.length > 0 && !tabAtiva.value) {
      const primeiraCategoria = [...cats].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0]
      tabAtiva.value = primeiraCategoria.id
    }

    snackbar.trigger(`${message}!`, 'success')
  } catch (error: any) {
    verifyError(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  carregarMenu()
})
</script>

<style scoped>
.border-b-lg {
  border-bottom: 3px solid rgb(var(--v-theme-primary));
}
</style>