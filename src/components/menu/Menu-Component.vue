<template>
  <v-container fluid class="pa-6">
    <!-- HEADER COM BUSCA -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold mb-2">Nosso Cardápio 🍽️</h1>
        <p class="text-body-2 text-medium-emphasis">
          Descubra nossos deliciosos produtos
        </p>
      </v-col>
      <v-col cols="12" md="6" class="d-flex align-center gap-3">
        <v-text-field
            v-model="searchQuery"
            placeholder="Busque por um produto"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            class="flex-grow-1"
        />
        <v-btn
            color="primary"
            icon="mdi-refresh"
            @click="carregarMenu"
            :loading="loading"
            variant="tonal"
        />
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
          class="border rounded-lg sticky-nav mb-6"
          elevation="1"
      >
        <v-card-text class="pa-3">
          <div class="d-flex align-center gap-2 overflow-x-auto categoria-nav">
            <v-btn
                v-for="categoria in categoriasOrdenadas"
                :key="categoria.id"
                :color="categoriaAtiva === categoria.id ? 'primary' : 'default'"
                :variant="categoriaAtiva === categoria.id ? 'flat' : 'outlined'"
                @click="scrollToCategoria(categoria.id!)"
                rounded="pill"
                size="default"
                class="text-none px-5"
            >
              {{ categoria.descricao || 'Sem categoria' }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <div v-if="categoriasOrdenadas.length > 0" ref="menuContainer">
        <div
            v-for="categoria in categoriasOrdenadas"
            :key="categoria.id"
            :ref="el => setCategoriaRef(categoria.id!, el)"
            class="categoria-section mb-10"
        >
          <!-- CABEÇALHO DA CATEGORIA -->
          <div class="mb-5">
            <h2 class="text-h5 font-weight-bold mb-1">
              {{ categoria.descricao || 'Sem categoria' }}
            </h2>
            <p class="text-body-2 text-medium-emphasis">
              {{ categoria.observacoes || getCategoriaDescricao(categoria) }}
            </p>
          </div>

          <!-- GRID DE PRODUTOS -->
          <v-row v-if="getProdutosPorCategoria(categoria.id).length > 0">
            <v-col
                v-for="produto in getProdutosPorCategoria(categoria.id)"
                :key="produto.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
              <ProdutoCard :produto="produto" @adicionar="addProduto($event)" />
            </v-col>
          </v-row>

          <!-- CATEGORIA VAZIA -->
          <v-card v-else class="border rounded-lg" elevation="0">
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
          <v-card class="border rounded-lg" elevation="0">
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
const searchQuery = ref<string>('')
const categoriaAtiva = ref<number | undefined>(undefined)
const menuContainer = ref<HTMLElement | null>(null)
const categoriaRefs = ref<Record<number, HTMLElement>>({})

// Categorias ordenadas
const categoriasOrdenadas = computed(() => {
  return [...categorias.value]?.sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
})
function addProduto(event: any){
  return event
}
// Produtos por categoria com filtro de busca
const produtosPorCategoria = computed(() => {
  const grupos: Record<number, Produto[]> = {}

  produtos.value.forEach(produto => {
    const catId = produto.categoria_id || 0

    // Filtro de busca
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const nome = (produto.nome || '').toLowerCase()
      const descricao = (produto.descricao || '').toLowerCase()

      if (!nome.includes(query) && !descricao.includes(query)) {
        return
      }
    }

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

function getCategoriaDescricao(categoria: Categoria): string {
  const count = getProdutosPorCategoria(categoria.id).length
  return `${count} ${count === 1 ? 'produto disponível' : 'produtos disponíveis'}`
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
    const offset = 140
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
  const scrollPosition = window.scrollY + 200

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
  top: 64px;
  z-index: 10;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.categoria-nav {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.categoria-nav::-webkit-scrollbar {
  display: none;
}

.categoria-section {
  scroll-margin-top: 160px;
}
</style>