import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/pages/Auth/Login.vue";
import Register from "@/pages/Auth/Register.vue";
import Cliente from "@/pages/Clientes/Cliente.vue";
import {getLoggedIn} from "@/services/auth/auth.service.ts";
import Mesa from "@/pages/Mesas/Mesa.vue";
import Home from "@/pages/Home/Home.vue";
import NotFound from "@/pages/Auth/NotFound.vue";
import StatusMesa from "@/pages/Status/StatusMesa.vue";
import Ambiente from "@/pages/Registros/Ambiente/Ambiente.vue";
import Perfil from "@/pages/Tipos/Perfil/Perfil.vue";
import StatusPedido from "@/pages/Status/StatusPedido.vue";
import StatusItemPedido from "@/pages/Status/StatusItemPedido.vue";
import Funcionario from "@/pages/Registros/Funcionario/Funcionario.vue";
import Produto from "@/pages/Registros/Produto/Produto.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
      {
          path: '',
          redirect: '/login',
      },
      {
          path: '/login',
          component: Login,
          name: "Login",
          meta:{
                hideLatBar: true,
                hideNavBar: true,
                requiresAuth: false,
          }
      },
      {
          path: "/register",
          component: Register,
          name: "Register",
          meta: {
              hideLatBar: true,
              hideNavBar: true,
              requiresAuth: false
          },
      },
      {
          path: "/cliente",
          component: Cliente,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/ambiente",
          component: Ambiente,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/inicio",
          component: Home,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/mesa",
          component: Mesa,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/produto",
          component: Produto,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/funcionario",
          component: Funcionario,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/tipo-perfil",
          component: Perfil,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/status-mesa",
          component: StatusMesa,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/status-item-pedido",
          component: StatusItemPedido,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: "/status-pedido",
          component: StatusPedido,
          meta: {
              hideLatBar: false,
              hideNavBar: false,
              requiresAuth: true
          },
      },
      {
          path: '/:pathMatch(.*)*',
          component: NotFound,
          name: "NotFound",
          meta: {
              hideLatBar: true,
              hideNavBar: true,
              requiresAuth: false
          }
      }
  ],
})

router.beforeEach(async (to, from, next) => {
    console.log(to.path)
    if (to.meta.requiresAuth && !getLoggedIn()) {
        return next("/login");
    }
    next();
});

export default router
