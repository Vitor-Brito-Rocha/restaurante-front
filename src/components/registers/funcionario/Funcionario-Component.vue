<template>
  <v-card>
    <v-card-title class="d-flex justify-center align-center w-100">
      {{dados?.id ? 'Editar Funcionário ('+ dados.id +')'  : 'Cadastrar Funcionário'}}
    </v-card-title>
    <v-form @submit.prevent="dados?.id ? editTable() : saveTable()">
      <v-card-text v-if="isMobile()">
          <v-autocomplete variant="outlined" label="Tipo de Pessoa" item-title="descricao" item-value="id" v-model="dados.tipo" :items="[{id: 1, descricao: 'Pessoa Física'}, {id: 2, descricao: 'Pessoa Jurídica'}]" />
          <v-autocomplete variant="outlined" label="Perfil" item-title="descricao" item-value="id" v-model="dados.tipo_perfil_id" :items="perfisList" />
        <v-text-field
            label="Nome"
            variant="outlined"
            type="text"
            v-model="dados.nome"
        />
        <v-text-field
              label="Email"
              variant="outlined"
              type="email"
              v-model="dados.email"
          />

          <v-text-field
              v-if="!dados.id"
              label="Senha"
              variant="outlined"
              type="password"
              v-model="dados.senha"
          />
          <v-mask-input mask="(##) #####-####" label="Telefone" variant="outlined" v-model="dados.telefone" />
        <v-divider class="my-4" v-if="dados.tipo" />
        <div v-if="dados.tipo === 1">
          <v-mask-input
              label="CPF"
              mask="###.###.###-##"
              variant="outlined"
              v-model="fisica.cpf"
          />

          <v-text-field
              label="Data de Nascimento"
              type="date"
              variant="outlined"
              v-model="fisica.data_nascimento"
          />
        </div>
        <div v-if="dados.tipo === 2">
          <v-mask-input
              label="CNPJ"
              mask="##.###.###/####-##"
              variant="outlined"
              v-model="juridica.cnpj"
          />
          <v-text-field label="Razão Social" variant="outlined" v-model="juridica.razao_social" />
        </div>
        <v-divider class="my-4" />
          <v-mask-input
              label="CEP"
              mask="#####-###"
              @update:model-value="val => { val.trim().length>= 8 ? findCEP(val) : ''}"
              variant="outlined"
              v-model="endereco.cep"
          />
          <v-text-field label="Logradouro"  variant="outlined" v-model="endereco.logradouro" />
          <v-text-field label="Número"  variant="outlined" v-model="endereco.numero" />
          <v-text-field label="Complemento" variant="outlined" v-model="endereco.complemento" />
          <v-text-field label="Bairro" variant="outlined" v-model="endereco.bairro" />
          <v-text-field label="Cidade" variant="outlined" v-model="endereco.localidade" />
          <v-text-field label="Estado" variant="outlined" v-model="endereco.estado" />
      </v-card-text>
      <v-card-text v-else>
        <div class="d-flex justify-center gap-3 align-center items-center">
          <v-autocomplete variant="outlined" label="Tipo de Pessoa" item-title="descricao" item-value="id" v-model="dados.tipo" :items="[{id: 1, descricao: 'Pessoa Física'}, {id: 2, descricao: 'Pessoa Jurídica'}]" />
          <v-text-field
              label="Nome"
              variant="outlined"
              type="text"
              v-model="dados.nome"
          />
          <v-text-field
              label="Email"
              variant="outlined"
              type="email"
              v-model="dados.email"
          />

          <v-text-field
              v-if="!dados.id"
              label="Senha"
              variant="outlined"
              type="password"
              v-model="dados.senha"
          />
          <v-mask-input mask="(##) #####-####" label="Telefone" variant="outlined" v-model="dados.telefone" />
          <v-autocomplete variant="outlined" label="Perfil" item-title="descricao" item-value="id" v-model="dados.tipo_perfil_id" :items="perfisList" />

        </div>
        <v-divider class="my-4" v-if="dados.tipo" />
        <div v-if="dados.tipo === 1" class="d-flex justify-center gap-3 align-center items-center">
          <v-mask-input
              label="CPF"
              mask="###.###.###-##"
              variant="outlined"
              v-model="fisica.cpf"
          />

          <v-text-field
              label="Data de Nascimento"
              type="date"
              variant="outlined"
              v-model="fisica.data_nascimento"
          />
        </div>
        <div v-if="dados.tipo === 2" class="d-flex justify-center gap-3 align-center items-center">
          <v-mask-input
              label="CNPJ"
              mask="##.###.###/####-##"
              variant="outlined"
              v-model="juridica.cnpj"
          />
          <v-text-field label="Razão Social" variant="outlined" v-model="juridica.razao_social" />
        </div>
        <v-divider class="my-4" />
        <div  class="d-flex justify-center gap-3 align-center items-center">
          <v-mask-input
              label="CEP"
              mask="#####-###"
              width="30%"
              @update:model-value="val => { val.trim().length>= 8 ? findCEP(val) : ''}"
              variant="outlined"
              v-model="endereco.cep"
          />
          <v-text-field label="Logradouro" width="50%" variant="outlined" v-model="endereco.logradouro" />
          <v-text-field label="Número" width="20%" variant="outlined" v-model="endereco.numero" />
        </div>
        <div  class="d-flex justify-center gap-3 align-center items-center">
          <v-text-field label="Complemento" width="30%" variant="outlined" v-model="endereco.complemento" />
          <v-text-field label="Bairro" width="25%" variant="outlined" v-model="endereco.bairro" />
          <v-text-field label="Cidade" width="25%" variant="outlined" v-model="endereco.localidade" />
          <v-text-field label="Estado" width="20%" variant="outlined" v-model="endereco.estado" />
        </div>
      </v-card-text>
      <v-card-actions class="justify-space-around">
        <v-btn color="error" @click="$emit('close')" prepend-icon="mdi-close">Fechar</v-btn>
        <v-btn color="success" type="submit" prepend-icon="mdi-check">{{dados?.id ? 'Editar' : 'Salvar'}}</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'
import type {Fisica, Funcionario, Juridica} from "@/models/Registros/Funcionario.ts";
import {createFuncionario, updateFuncionario} from "@/services/funcionario/funcionario.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {findAdressByCEP, isMobile} from "@/services/system/system.service.ts";
import type {Endereco} from "@/models/Endereco.ts";
import {getPerfisAll} from "@/services/perfil/perfil.service.ts";
const dados = ref<Funcionario>({})
const fisica = ref<Fisica>({})
const juridica = ref<Juridica>({})
const endereco = ref<Endereco>({})
const snackbar = useSnackbarStore()
const perfisList = ref<any[]>([])
const emit = defineEmits(['close'])
const props = defineProps<{
  dados?: Funcionario;
}>()
onMounted(async () => {
  perfisList.value = await getPerfisAll().then(r => r.perfis)
  if(props.dados?.id){
    dados.value = { ...props.dados }
  }
  if(props.dados?.tipo === 1){
    fisica.value = {cpf: props.dados.documento, data_nascimento: props.dados.data_nascimento}
  }
  if(props.dados?.tipo === 2){
    juridica.value = {cnpj: props.dados.documento, razao_social: props.dados.razao_social}
  }
  if (props.dados?.endereco) {
    endereco.value = { ...props.dados.endereco, localidade: props.dados.endereco.cidade}
  }
})
async function saveTable() {
  try {
    const payload = {
      principal: {
        tipo: dados.value.tipo,
        nome: dados.value.nome,
        telefone: dados.value.telefone,
        email: dados.value.email
      },
      fisica: dados.value.tipo === 1 ? fisica.value : undefined,
      juridica: dados.value.tipo === 2 ? juridica.value : undefined,
      endereco: endereco.value,
      usuario: {
        email: dados.value.email,
        senha: dados.value.senha,
        tipo_perfil_id: dados.value.tipo_perfil_id
      }
    }

    await createFuncionario(payload)
    snackbar.trigger("Funcionário criado com sucesso!", "success")
    emit('close')
  } catch {
    snackbar.trigger("Não foi possível criar funcionário", "error")
  }
}

async function editTable(){
  try{
    const payload = {
      principal: {
        tipo: dados.value.tipo,
        nome: dados.value.nome,
        telefone: dados.value.telefone,
        email: dados.value.email
      },
      fisica: dados.value.tipo === 1 ? fisica.value : undefined,
      juridica: dados.value.tipo === 2 ? juridica.value : undefined,
      endereco: endereco.value,
      usuario: {
        email: dados.value.email,
        tipo_perfil_id: dados.value.tipo_perfil_id
      }
    }
    await updateFuncionario(dados.value.id!, payload)
    snackbar.trigger("Funcionário atualizada com sucesso!", "success")
    emit('close')
  } catch (error: any) {
    snackbar.trigger("Não foi possível editar funcionário, tente novamente mais tarde", "error")
  }
}
async function findCEP(val: string){
  try{
  const address = await findAdressByCEP(val)
  endereco.value = {...address}
  } catch (error: any){

  }
}
</script>
<style scoped>

</style>