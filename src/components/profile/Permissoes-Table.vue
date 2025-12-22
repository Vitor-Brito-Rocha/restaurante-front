<template>
<v-expansion-panels elevation="2">
  <div class="w-100 font-bold text-h6">
    <v-row class="w-100">
      <v-col class="justify-center d-flex">
        Código
      </v-col>
      <v-col class="justify-center d-flex">Título</v-col>
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

          <v-btn :color="item.modulo_permitido ? 'success' : 'error'" @click="item.modulo_permitido ? $emit('associateModule', {modulo: item.modulo_id}) : $emit('disassociateModule', {modulo: item.modulo_id})">{{item.modulo_permitido ? 'Revogar' : 'Conceder'}}</v-btn>

        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text>

      <v-row>
        <v-col class="justify-center d-flex">Listar</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Listar ? 'success' : 'error'" @click="item.acoes.Listar ? $emit('associateEndpoint', {acao: 'LISTAR'}) : $emit('disassociateEndpoint', {acao: 'LISTAR'})">{{item.acoes.Listar ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2"/>
      <v-row>
        <v-col class="justify-center d-flex">Criar</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Criar ? 'success' : 'error'" @click="item.acoes.Criar ? $emit('associateEndpoint', {acao: 'CRIAR'}) : $emit('disassociateEndpoint', {acao: 'CRIAR'})">{{item.acoes.Criar ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2"/>
      <v-row>
        <v-col class="justify-center d-flex">Editar</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Editar ? 'success' : 'error'" @click="item.acoes.Editar ? $emit('associateEndpoint', {acao: 'EDITAR'}) : $emit('disassociateEndpoint', {acao: 'EDITAR'})">{{item.acoes.Editar ? 'Revogar' : 'Conceder'}}</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-2"/>
      <v-row>
        <v-col class="justify-center d-flex">Excluir</v-col>
        <v-col class="justify-center d-flex">
          <v-btn :color="item.acoes.Excluir ? 'success' : 'error'" @click="item.acoes.Excluir ? $emit('associateEndpoint', {acao: 'EXCLUIR'}) : $emit('disassociateEndpoint', {acao: 'EXCLUIR'})">{{item.acoes.Excluir ? 'Revogar' : 'Conceder'}}</v-btn>
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