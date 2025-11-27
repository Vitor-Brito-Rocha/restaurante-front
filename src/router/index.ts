import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/pages/Auth/Login.vue";
import {supabase} from "@/supabase.ts";
import Register from "@/pages/Auth/Register.vue";
import Cliente from "@/pages/Clientes/Cliente.vue";
import {getToken} from "@/services/auth/auth.service.ts";
import Mesa from "@/pages/Mesas/Mesa.vue";
import Home from "@/pages/Home/Home.vue";
import NotFound from "@/pages/Auth/NotFound.vue";
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
    if (to.meta.requiresAuth && !getToken()) {
        return next("/login");
    }
    next();
});

export default router
