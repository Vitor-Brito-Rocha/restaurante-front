<template>
    <v-container class="limit d-flex justify-center text-center items-center align-center">
      <v-card class="d-flex justify-center text-center items-center align-center">
        <v-form class="cartao-register" @submit.prevent="registrar">
          <div class="cartao-titulo">
            <v-card-title class="cartao-titulo">
              <h2 class="cartao-titulo">Cadastre sua conta!</h2>
            </v-card-title>
          </div>
          <div>
            <v-card-text>
              <v-text-field  :rules="[rules.required('Preencha o campo corretamente')]"
                             v-model="nome"
                             type="text"
                             density="comfortable"
                             placeholder="Insira seu nome completo"
                             label="Nome completo"
              />
              <v-text-field v-maska="'###.###.###-##'"
                            :rules="[rules.required('Preencha o campo corretamente')]"  v-model="cpf" density="comfortable" label="CPF" placeholder="Insira o seu CPF"
              />
              <v-text-field v-maska="'(##) #####-####'" :rules="[rules.required('Preencha o campo corretamente')]" label="Whatsapp"  v-model="whatsapp" type="text" placeholder="Insira seu WhatsApp"/>
              <v-text-field  :rules="[rules.required('Preencha o campo corretamente')]" density="comfortable" label="Email" v-model="email" type="email" placeholder="Insira seu email"></v-text-field>
              <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :rules="[rules.required('Preencha o campo corretamente')]"
                            v-model="senha"
                            :type="visible ? 'text' : 'password'"
                            density="comfortable"
                            label="Senha"
                            placeholder="Insira sua senha"
                            @click:append-inner="visible = !visible"></v-text-field>
              <v-btn
                  type="submit"
                  block
                  color="primary"
                  size="large"
                  prepend-icon="mdi-login"
                  :loading="loading"
                  class="mt-2"
              >
                Entrar
              </v-btn>
            </v-card-text>
            <div class="text-subtitle-2">
              Já possui conta?
              <router-link to="/login">Faça seu login aqui</router-link>
            </div>
          </div>
        </v-form>
      </v-card>
    </v-container>
</template>
<script setup lang="ts">
import { vMaska } from "maska/vue"
import { ref } from "vue";
import { supabase } from "@/supabase.ts";
import { useRouter } from "vue-router";
import {register} from "@/services/auth/auth.service.ts";
import {useSnackbarStore} from "@/stores/snackbar.ts";
const visible = ref(false);
const email = ref("");
const snackbar = useSnackbarStore();
const text = ref("")
const rules = {
  required (message: string) {
    return (value: string) => !!value || message
  }
}
const senha = ref("");
const nome = ref("");
const cpf = ref("");
const whatsapp = ref("");
const loading = ref(false);
const router = useRouter();

const registrar = () => {
  loading.value = true;
  if(cpf.value == "" || whatsapp.value == "" || nome.value == "" || email.value == "" || senha.value == "") {
    snackbar.trigger("Preencha todos os campos!", "error");
    loading.value = false;
    return;
  }
  const user = {
      nome: nome.value,
      email: email.value,
      senha_hash: senha.value,
      cpf: cpf.value,
      telefone: whatsapp.value,
      tipo_perfil_id: 5,
  }

  registerUsuario(user)
};
async function registerUsuario(user: any) {
  try {
    const response = await register(user) // <<< aqui entra o await
    console.log(response.data, 'resposta')
    snackbar.trigger("Sucesso! Bem-vindo ao sistema Restaurante", "primary")
    await router.push("/home")
  }
  catch (error: any) {
    console.error(error)
    snackbar.trigger("Erro ao registrar usuário", "error")
  }
  finally {
    loading.value = false
  }
}
</script>
<style scoped>
.limit{
  font-family: "Roboto", sans-serif;
  height: 90dvh;
  width: 100dvw;
}
.cartao-titulo{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 28px;
}
.cartao-register{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

}
.snackbar{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 20px;
  margin: 0;
  padding: 0;
}
</style>
