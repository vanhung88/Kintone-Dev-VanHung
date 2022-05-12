;(function () {
    'use strict'

    const eventsSubmit = ['mobile.app.record.create.show']
    kintone.events.on(eventsSubmit, function (event) {
        const record = event.record
    })
})()
