<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
      {{dados?.id ? 'Editar Produto ('+ dados.id +')'  : 'Cadastrar Produto'}}
    </v-card-title>
    <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
      <v-card-text>
        <div v-if="isMobile()" class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="Nome" variant="outlined" v-model="dados.nome" required />
          <v-text-field label="Descrição" variant="outlined" v-model="dados.descricao" />
          <v-text-field label="Preço" type="number" step="0.01" pattern="^\d*(\.\d{0,2})?$"  variant="outlined" v-model="dados.preco" required />
          <v-autocomplete
              :items="categorias"
              item-value="id"
              item-title="descricao"
              label="Categoria"
              variant="outlined"
              v-model="dados.categoria_id"
              required
          />
          <v-switch variant="outlined" v-model="dados.ativo" label="Ativo" />
          <div class="ga-3 d-flex flex-column h-auto w-100">
            <div v-if="previewUrl || dados.imagem_url" class="text-center">
              <v-img
                  :src="previewUrl || dados.imagem_url"
                  max-width="400"
                  max-height="400"
                  class="mx-auto rounded"
              ></v-img>
              <v-btn
                  v-if="dados.imagem_url && !previewUrl"
                  color="error"
                  variant="text"
                  size="small"
                  class="mt-2"
                  @click="removerImagem"
              >
                Remover Imagem
              </v-btn>
            </div>
            <div>
            <v-file-input
                variant="outlined"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                label="Imagem"
                v-model="imagemProduto"
                accept="image/*"
                @change="handleImageChange"
                :clearable="true"
                @click:clear="removerImagem"
                clear-icon="mdi-close-circle"
             />
            </div>
          </div>
        </div>
        <div v-else class="gap-3">
          <div class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="Nome" variant="outlined" v-model="dados.nome" required />
          <v-text-field label="Descrição" variant="outlined" v-model="dados.descricao" />
          <v-text-field label="Preço" type="number" step="0.01" pattern="^\d*(\.\d{0,2})?$"  variant="outlined" v-model="dados.preco" required />
          </div>
          <div class="d-flex justify-center gap-3 align-center items-center">
            <v-autocomplete
              :items="categorias"
              item-value="id"
              item-title="descricao"
              label="Categoria"
              variant="outlined"
              v-model="dados.categoria_id"
              required
          />
          <v-switch variant="outlined" v-model="dados.ativo" label="Ativo" />
          </div>
          <div class="ga-3 d-flex flex-column h-auto w-100">
            <div v-if="previewUrl || dados.imagem_url" class="text-center">
              <v-img
                  :src="previewUrl! || dados.imagem_url!"
                  max-width="400"
                  max-height="400"
                  class="mx-auto rounded"
              ></v-img>
              <v-btn
                  v-if="dados.imagem_url && !previewUrl"
                  color="error"
                  variant="text"
                  size="small"
                  class="mt-2"
                  @click="removerImagem"
              >
                Remover Imagem
              </v-btn>
            </div>
            <div>
              <v-file-input
                  variant="outlined"
                  prepend-icon=""
                  prepend-inner-icon="mdi-camera"
                  label="Imagem"
                  v-model="imagemProduto"
                  accept="image/*"
                  @change="handleImageChange"
                  :clearable="true"
                  @click:clear="removerImagem"
                  clear-icon="mdi-close-circle"
              />
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="justify-space-around">
        <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
        <v-btn
            color="success"
            type="submit"
            prepend-icon="mdi-check"
            :loading="loading"
        >
          {{dados?.id ? 'Editar' : 'Salvar'}}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {isMobile} from "@/services/system/system.service.ts";
import type {Produto} from "@/models/Registros/Produto.ts";
import {createProduto, updateProduto} from "@/services/cadastro/produto/produto.service.ts";
import {getCategoriaAll} from "@/services/cadastro/produto/categoria.service.ts";

const dados = ref<Produto>({
  ativo: true,
});
const categorias = ref<any[]>([])
const imagemProduto = ref<File | null>() //
const previewUrl = ref<string | null>(null)
const loading = ref(false)
const removerImagemFlag = ref(false)

const snackbar = useSnackbarStore()
const emit = defineEmits(['close'])

const props = defineProps<{
  dados?: Produto;
}>()

onMounted(() => {
  if(props.dados?.id){
    dados.value = {...props.dados};
  }
  getData()
})

async function getData(){
  try {
    categorias.value = await getCategoriaAll().then(r => r.categorias)
  } catch (error) {
    snackbar.trigger("Erro ao carregar categorias", "error")
  }
}

function handleImageChange(event: any) {
  const file = event.target?.files[0] || imagemProduto.value
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
    removerImagemFlag.value = false
  }
}

function removerImagem() {
  dados.value.imagem_url = null
  imagemProduto.value = null
  previewUrl.value = null
  removerImagemFlag.value = true
}

async function saveTable(){
  loading.value = true
  try{
    const file = imagemProduto.value
    await createProduto(dados.value, file ? file : undefined)
    snackbar.trigger("Produto criado com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    console.error(error)
    snackbar.trigger("Não foi possível criar Produto: " + (error.message || "Erro desconhecido"), "error")
  } finally {
    loading.value = false
  }
}

async function editTable(){
  loading.value = true
  try{
    const file = imagemProduto.value
    await updateProduto(dados.value.id!, dados.value, file, removerImagemFlag.value)
    snackbar.trigger("Produto atualizado com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    console.error(error)
    snackbar.trigger("Não foi possível atualizar Produto: " + (error.message || "Erro desconhecido"), "error")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>