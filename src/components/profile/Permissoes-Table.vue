<template>
<v-expansion-panels elevation="2">
  <div class="w-100 font-bold text-h6">
    <v-row class="w-100">
      <v-col class="justify-center d-flex">
        Código
      </v-col>
      <v-col class="justify-center d-flex">Título - Tela</v-col>
      <v-col class="justify-center d-flex">
      Permissão
      </v-col>
    </v-row>
  </div>
  <v-expansion-panel class="border" v-for="item in props.data">
    <v-expansion-panel-title class="w-100">
      <v-row class="w-100">
        <v-col class="justify-center d-flex">
          {{item.modulo_id}}
        </v-col >
        <v-col class="justify-center d-flex">{{item.modulo_titulo}}</v-col>
        <v-col class="justify-center d-flex">

          <v-btn :color="item.modulo_permitido ? 'error' : 'success'" @click="item.modulo_permitido ? $emit('disassociateModule', {modulo_id: item.modulo_id}) : $emit('associateModule', {modulo_id: item.modulo_id})">{{item.modulo_permitido ? 'Revogar' : 'Conceder'}}</v-btn>

        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text>

      <v-row>
        <v-col class="justify-center d-flex">Listar</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Listar ? 'error' : 'success'" @click="item.acoes.Listar ? $emit('disassociateEndpoint', {acao: 'LISTAR', modulo_id: item.modulo_id}) : $emit('associateEndpoint', {acao: 'LISTAR', modulo_id: item.modulo_id})">{{item.acoes.Listar ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2"/>
      <v-row>
        <v-col class="justify-center d-flex">Criar</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Criar ? 'error' : 'success'" @click="item.acoes.Criar ? $emit('disassociateEndpoint', {acao: 'CRIAR', modulo_id: item.modulo_id}) : $emit('associateEndpoint', {acao: 'CRIAR', modulo_id: item.modulo_id})">{{item.acoes.Criar ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2"/>
      <v-row>
        <v-col class="justify-center d-flex">Editar</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Editar ? 'error' : 'success'" @click="item.acoes.Editar ? $emit('disassociateEndpoint', {acao: 'EDITAR', modulo_id: item.modulo_id}) : $emit('associateEndpoint', {acao: 'EDITAR', modulo_id: item.modulo_id})">{{item.acoes.Editar ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2"/>
      <v-row>
        <v-col class="justify-center d-flex">Excluir</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Excluir ? 'error' : 'success'" @click="item.acoes.Excluir ? $emit('disassociateEndpoint', {acao: 'EXCLUIR', modulo_id: item.modulo_id}) : $emit('associateEndpoint', {acao: 'EXCLUIR', modulo_id: item.modulo_id})">{{item.acoes.Excluir ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</v-expansion-panels>
</template>
<script setup lang="ts">
import type {ModuloProfile} from "@/models/Perfil/Perfil.ts";
const emit = defineEmits(["updateTable", "associateModule", "disassociateModule", "associateEndpoint", "disassociateEndpoint"]);
const props = defineProps<{
  data: ModuloProfile[]
}>()
</script>
<style scoped></style>