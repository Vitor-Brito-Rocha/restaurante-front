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

    <!-- NAVEGAÇÃO DE CATEGORIAS (STICKY) -->
    <div v-else>
      <v-card
          v-if="categoriasOrdenadas.length > 0"
          class="border rounded sticky-nav mb-6"
          elevation="2"
      >
        <v-card-text class="pa-4">
          <v-btn-group class="d-flex justify-center flex-wrap ga-4">
            <v-btn
                class="text-gray-800 border"
                v-for="categoria in categoriasOrdenadas"
                :key="categoria.id"
                :base-color="categoriaAtiva === categoria.id ? 'primary' : 'default'"
                :variant="categoriaAtiva === categoria.id ? 'flat' : 'outlined'"
                @click="scrollToCategoria(categoria.id!)"
            >
              {{ categoria.descricao || 'Sem categoria' }}
            </v-btn>
          </v-btn-group>
        </v-card-text>
      </v-card>

      <!-- LISTA CONTÍNUA DE CATEGORIAS E PRODUTOS -->
      <div v-if="categoriasOrdenadas.length > 0" ref="menuContainer">
        <div
            v-for="categoria in categoriasOrdenadas"
            :key="categoria.id"
            :ref="el => setCategoriaRef(categoria.id!, el)"
            class="categoria-section mb-8"
        >
          <!-- TÍTULO DA CATEGORIA -->
          <v-card class="border mb-4" rounded="l" elevation="0">
            <v-card-text class="pa-4">
              <h2 class="text-h5 font-weight-bold">
                {{ categoria.descricao || 'Sem categoria' }}
              </h2>
              <p class="text-medium-emphasis text-body-2 mt-1">
                {{ getProdutosPorCategoria(categoria.id).length }}
                {{ getProdutosPorCategoria(categoria.id).length === 1 ? 'produto' : 'produtos' }}
              </p>
            </v-card-text>
          </v-card>

          <!-- PRODUTOS DA CATEGORIA -->
          <v-row no-gutters v-if="getProdutosPorCategoria(categoria.id).length > 0">
            <v-col
                v-for="produto in getProdutosPorCategoria(categoria.id)"
                :key="produto.id"
            >
              <ProdutoCard :produto="produto" />
            </v-col>
          </v-row>

          <!-- CATEGORIA VAZIA -->
          <v-card v-else class="border rounded" elevation="0">
            <v-card-text class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1">mdi-food-off</v-icon>
              <p class="text-body-1 text-medium-emphasis mt-3">
                Nenhum produto disponível nesta categoria
              </p>
            </v-card-text>
          </v-card>
        </div>
      </div>

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
import { ref, onMounted, computed, onUnmounted } from 'vue'
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
const categoriaAtiva = ref<number | undefined>(undefined)
const menuContainer = ref<HTMLElement | null>(null)
const categoriaRefs = ref<Record<number, HTMLElement>>({})

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

  return prods
      .filter(p => p.ativo !== false)
      .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
}

// Guarda as referências dos elementos de categoria
function setCategoriaRef(categoriaId: number, el: any) {
  if (el) {
    categoriaRefs.value[categoriaId] = el
  }
}

// Scroll suave até a categoria
function scrollToCategoria(categoriaId: number) {
  const elemento = categoriaRefs.value[categoriaId]
  if (elemento) {
    const offset = 120 // Offset para compensar a barra de navegação sticky
    const elementPosition = elemento.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })

    categoriaAtiva.value = categoriaId
  }
}

// Detecta qual categoria está visível durante o scroll
function handleScroll() {
  const scrollPosition = window.scrollY + 200 // Offset para trigger mais cedo

  for (const categoria of categoriasOrdenadas.value) {
    const elemento = categoriaRefs.value[categoria.id!]
    if (elemento) {
      const rect = elemento.getBoundingClientRect()
      const elementTop = rect.top + window.pageYOffset

      if (scrollPosition >= elementTop - 200) {
        categoriaAtiva.value = categoria.id
      }
    }
  }
}

async function carregarMenu() {
  loading.value = true

  try {
    const { menu, categorias: cats, message } = await getMenu()
    produtos.value = menu
    categorias.value = cats

    // Define a primeira categoria como ativa
    if (cats.length > 0 && !categoriaAtiva.value) {
      const primeiraCategoria = [...cats].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0]
      categoriaAtiva.value = primeiraCategoria.id
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
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.sticky-nav {
  position: sticky;
  top: 64px; /* Ajuste conforme a altura do seu header */
  z-index: 10;
  background-color: rgb(var(--v-theme-surface));
}

.categoria-section {
  scroll-margin-top: 140px; /* Espaço para a navegação sticky */
}
</style>