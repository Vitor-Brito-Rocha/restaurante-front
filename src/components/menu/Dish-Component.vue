<!-- ProdutoCard.vue -->
<template>
  <v-card class="border produto-card" rounded="xl" elevation="0" hover>
    <!-- IMAGEM -->
    <div class="produto-imagem">
      <v-img
          v-if="produto.imagem_url && !imageError"
          :src="produto.imagem_url"
          :alt="produto.nome || 'Produto'"
          height="200"
          cover
          @error="imageError = true"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey-lighten-2" />
          </v-row>
        </template>
      </v-img>

      <div v-else class="produto-imagem-placeholder">
        <v-icon size="64" color="grey-lighten-1">mdi-food</v-icon>
      </div>
      <!-- BADGE INDISPONÍVEL -->
      <v-chip
          v-if="!produto.ativo"
          class="produto-badge"
          color="error"
          size="small"
          label
      >
        Indisponível
      </v-chip>
    </div>

    <v-divider />

    <!-- CONTEÚDO -->
    <v-card-text class="pa-4">
      <h3 class="text-h6 font-weight-bold mb-1 text-truncate">
        {{ produto.nome || 'Sem nome' }}
      </h3>

      <p
          v-if="produto.descricao"
          class="text-body-2 text-medium-emphasis produto-descricao mb-2"
      >
        {{ produto.descricao }}
      </p>

      <div class="d-flex align-center justify-space-between">
        <span class="text-h5 font-weight-bold text-success">
          R$ {{ formatarPreco(produto.preco || 0) }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Produto {
  id?: number
  descricao?: string
  nome?: string
  imagem_url?: string | null
  preco?: number
  categoria_id?: number
  ativo?: boolean
  ordem?: number
}

defineProps<{
  produto: Produto
}>()

const imageError = ref(false)

function formatarPreco(valor: any): string {
  valor = Number(valor)
  return valor.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.produto-card {
  max-height: 375px;
  width: 250px;
  max-width: 250px;
  height: 375px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.produto-card:hover {
  transform: translateY(-4px);
}

.produto-imagem {
  position: relative;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.produto-imagem-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.produto-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.produto-descricao {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 40px;
}
</style>