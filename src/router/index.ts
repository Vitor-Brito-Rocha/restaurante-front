import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/pages/Auth/Login.vue";
import {supabase} from "@/supabase.ts";
import Register from "@/pages/Auth/Register.vue";
import Client from "@/pages/Client/Client.vue";
import {getToken} from "@/services/auth/auth.service.ts";
import Mesa from "@/pages/Mesas/Mesa.vue";

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
          component: Client,
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
