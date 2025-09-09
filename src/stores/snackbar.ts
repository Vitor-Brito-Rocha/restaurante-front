// stores/snackbar.ts
import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
    state: () => ({
        show: false,
        message: '',
        color: 'success',
        timeout: 3000,
    }),
    actions: {
        trigger(message: string, color = 'success', timeout = 2400) {
            this.message = message
            this.color = color
            this.timeout = timeout
            this.show = true
        },
    },
    getters: {
        isVisible: (state) => state.show,
        snackbarColor: (state) => state.color,
    },
})
