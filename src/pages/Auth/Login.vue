<template>
  <div class="h-100 w-100" style="background: url('background.JPG'); background-repeat: no-repeat; background-size: cover;">
  <v-container  class="limit d-flex justify-center text-center items-center align-center">
    <v-card class="d-flex justify-center text-center items-center align-center">
      <v-form class="cartao-login" @submit.prevent="Login">
        <div class="cartao-titulo">
          <v-card-title class="cartao-titulo">
            <h2 class="cartao-titulo">Acesse sua conta</h2>
          </v-card-title>
        </div>
        <div>
          <v-card-text>
            <v-text-field :rules="[rules.required('Preencha o campo corretamente')]" density="comfortable" label="Email" v-model="email" type="email" placeholder="Insira seu email"></v-text-field>
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                          :rules="[rules.required('Preencha o campo corretamente')]"
                          v-model="senha"
                          :type="visible ? 'text' : 'password'"
                          density="comfortable"
                          label="Senha"
                          placeholder="Insira sua senha"
                          @click:append-inner="visible = !visible" required></v-text-field>
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
            Ainda não tem conta?
            <router-link to="/register">Registre-se aqui</router-link>
          </div>
        </div>
      </v-form>
    </v-card>
  </v-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {useSnackbarStore} from "@/stores/snackbar.ts";
import {login} from "@/services/auth/auth.service.ts";
import router from "@/router";
const email = ref("");
const senha = ref("");
const rules = {
  required (message: string) {
    return (value: string) => !!value || message
  }
}
const visible = ref(false);
const snackbar = useSnackbarStore();
const loading = ref(false);
const Login = async () => {
  try {
    loading.value = true;
    if(email.value == "" || senha.value == "") {
      snackbar.trigger("Preencha todos os campos!", "error");
      loading.value = false;
      return;
    }
    const user = {
      email: email.value,
      senha_hash: senha.value,
    }
    const response = await login(user)
    console.log(response, 'resposta')
    snackbar.trigger("Sucesso! Bem-vindo ao sistema Restaurante", "success")
    await router.push("/home")
  }
  catch (error: any) {
    console.error(error)
    snackbar.trigger("Erro ao se autenticar", "error")
  }
  finally {
    loading.value = false;
  }
};

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
.cartao-login{
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 300px;
  height: 320px;

}
</style>
