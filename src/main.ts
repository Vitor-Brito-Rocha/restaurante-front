import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Router
import router from './router'

// SCSS com variáveis
import '@/styles/theme-restaurant.css'

import App from './App.vue'


const vuetify = createVuetify({
    components,
    directives,
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    theme: {
        defaultTheme: 'theme_restaurant_light',
        themes: {
            theme_restaurant_light: {
                dark: false,
                colors: {
                    primary: "#1976D2",
                    secondary: "#90CAF9",
                    success: "#4CAF50",
                    error: "#F44336",
                    background: "#FFFFFF",
                    surface: "#F5F5F5",

                },
            },
            theme_restaurant_dark: {
                dark: true,
                colors: {
                    primary: "#0D47A1",   // azul mais escuro
                    secondary: "#1976D2", // secundário mais forte
                    success: "#66BB6A",   // verde escuro
                    error: "#EF5350",     // vermelho escuro
                    background: "#4D4D4D",
                    surface: "#1E1E1E",
                },
            },
        },
    },
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
