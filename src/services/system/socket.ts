import { io } from "socket.io-client"
const baseUrl = import.meta.env.VITE_SOCKET_URL;
export const socket = io(baseUrl, {
    autoConnect: true,
    transports: ["websocket"],
    withCredentials: true
})

export function joinPedido(pedidoId: number, garcomId?: number) {
    socket.emit("join-pedido", { pedidoId, garcomId })
}


export function onItemPronto(cb: (data: any) => void) {
    socket.on("item-pronto", cb)
}
