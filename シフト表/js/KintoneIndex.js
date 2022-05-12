;(function () {
    'use strict'

    const eventsSubmit = [
        'app.record.index.show',
        'app.record.index.delete.submit',
    ]
    kintone.events.on(eventsSubmit, function (e) {
        //code
        const record = e.records
    })
})()
