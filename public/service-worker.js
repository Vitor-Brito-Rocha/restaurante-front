self.addEventListener("push", event => {
    const data = event.data.json()

    self.registration.showNotification(data.title, {
        body: data.body,
        data: data.data,
        tag: `mesa-${data.data.mesaId}`
    })
})

self.addEventListener("notificationclick", event => {
    event.notification.close()

    event.waitUntil(
        clients.openWindow(`/mesa/${event.notification.data.mesaId}`)
    )
})
