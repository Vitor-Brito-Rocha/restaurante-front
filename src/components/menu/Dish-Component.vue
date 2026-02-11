<template>
  <v-card
      class="produto-card"
      :class="{ 'produto-indisponivel': !produto.ativo }"
      rounded="lg"
      elevation="0"
      hover
  >
    <!-- BADGES SUPERIORES -->
    <div class="badges-container">
      <v-chip
          v-if="produto.destaque"
          color="pink"
          size="small"
          label
          class="produto-badge"
      >
        EDIÇÃO LIMITADA
      </v-chip>
      <v-chip
          v-if="produto.brinde"
          color="error"
          size="small"
          class="produto-badge-icon"
          prepend-icon="mdi-gift"
      >
      </v-chip>
    </div>

    <!-- IMAGEM DO PRODUTO -->
    <div class="produto-imagem-wrapper">
      <v-img
          v-if="produto.imagem_url && !imageError"
          :src="produto.imagem_url"
          :alt="produto.nome || 'Produto'"
          height="200"
          cover
          class="produto-imagem"
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

      <!-- OVERLAY INDISPONÍVEL -->
      <div v-if="!produto.ativo" class="produto-overlay">
        <v-chip
            color="error"
            size="large"
            class="font-weight-bold"
        >
          Indisponível
        </v-chip>
      </div>
    </div>

    <!-- CONTEÚDO DO CARD -->
    <v-card-text class="pa-4 d-flex flex-column" style="height: 175px;">
      <!-- TÍTULO -->
      <h3 class="text-subtitle-1 font-weight-bold mb-2 produto-titulo">
        {{ produto.nome || 'Sem nome' }}
      </h3>

      <!-- DESCRIÇÃO -->
      <p
          v-if="produto.descricao"
          class="text-body-2 text-medium-emphasis produto-descricao flex-grow-1 mb-3"
      >
        {{ produto.descricao }}
      </p>
      <div v-else class="flex-grow-1"></div>

      <!-- RODAPÉ: PREÇO -->
      <div class="d-flex align-center justify-space-between mt-auto">
        <div>
          <span class="text-h6 font-weight-bold text-success">
            R$ {{ formatarPreco(produto.preco || 0) }}
          </span>
        </div>

        <v-btn
            v-if="produto.ativo && addAtivo"
            color="primary"
            size="small"
            variant="tonal"
            @click="adicionarAoCarrinho"
        >
          Adicionar
        </v-btn>
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
  destaque?: boolean
  brinde?: boolean
}
const addAtivo = false
const props = defineProps<{
  produto: Produto
}>()

const emit = defineEmits<{
  adicionar: [produto: Produto]
}>()

const imageError = ref(false)

function formatarPreco(valor: any): string {
  valor = Number(valor)
  return valor.toFixed(2).replace('.', ',')
}

function adicionarAoCarrinho() {
  emit('adicionar', props.produto)
}
</script>

<style scoped>
.produto-card {
  height: 100%;
  min-height: 375px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.produto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  border-color: rgb(var(--v-theme-primary));
}

.produto-indisponivel {
  opacity: 0.85;
}

.produto-indisponivel:hover {
  transform: none;
  box-shadow: none !important;
}

/* BADGES */
.badges-container {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: flex-end;
}

.produto-badge {
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
}

.produto-badge-icon {
  width: 36px;
  height: 36px;
  border-radius: 50% !important;
}

/* IMAGEM */
.produto-imagem-wrapper {
  position: relative;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
}

.produto-imagem {
  transition: transform 0.3s ease;
}

.produto-card:hover .produto-imagem {
  transform: scale(1.05);
}

.produto-imagem-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.produto-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

/* TEXTO */
.produto-titulo {
  line-height: 1.3;
  min-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.produto-descricao {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* RESPONSIVIDADE */
@media (max-width: 600px) {
  .produto-card {
    min-height: 340px;
  }

  .produto-imagem,
  .produto-imagem-placeholder {
    height: 160px;
  }
}
</style>