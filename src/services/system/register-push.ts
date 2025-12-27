import api from "@/api-axios.ts";

export async function registerPush(pedidoId: number) {
    const registration = await navigator.serviceWorker.ready

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
    })

    await api.post(`${import.meta.env.VITE_BASE_URL}/push/subscribe`, {
        pedidoId,
        subscription
    })

}
