self.addEventListener("push", event => {
    const data = event.data.json()

    self.registration.showNotification(data.title, {
        body: data.body,
        data: data.data,
        tag: `Pedido - #${data.data.pedidoId}`
    })
})

self.addEventListener("notificationclick", event => {
    event.notification.close()

    event.waitUntil(
        clients.openWindow(`/pedido/${event.notification.data.pedidoId}`)
    )
})
