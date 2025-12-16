self.addEventListener("push", event => {
    const data = event.data.json()

    self.registration.showNotification(data.title, {
        body: data.body,
        data: data.data,
        actions: [
            { action: "ver", title: "Ver detalhes" }
        ],
        tag: `mesa-${data.data.mesaId}`
    })
})

self.addEventListener("notificationclick", event => {
    event.notification.close()

    event.waitUntil(
        clients.openWindow(`/mesa/${event.notification.data.mesaId}`)
    )
})
