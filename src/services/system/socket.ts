import { io } from "socket.io-client"
const baseUrl = import.meta.env.VITE_SOCKET_URL;
export const socket = io(baseUrl, {
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true
})

export function joinMesa(mesaId: number, garcomId?: number) {
    socket.emit("join-mesa", { mesaId, garcomId })
}


export function onItemPronto(cb: (data: any) => void) {
    console.log("onItemPronto")
    socket.on("item-pronto", cb)
}
