import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/pages/Auth/Login.vue";
import {supabase} from "@/supabase.ts";
import Register from "@/pages/Auth/Register.vue";

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
          meta:{
                hideLatBar: true,
                hideNavBar: true,
                requiresAuth: false,
          }
      },
      { path: "/register", component: Register, meta: { hideLatBar: true, hideNavBar: true, requiresAuth: false } },
  ],
})
async function getCurrentUser() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) return null;

    const { data } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", session.user.id)
        .single();
    return { ...session.user, ...data };
}

// Middleware de rotas protegidas
router.beforeEach(async (to, from, next) => {
    const user = await getCurrentUser();
    console.log(to.path)

    // if (to.meta.requiresAdmin && !user?.is_admin) {
    //     return next("/nao-autorizado");
    // }

    if (to.meta.requiresAuth && !user) {
        return next("/login");
    }

    next();
});

export default router
