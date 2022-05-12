;(function () {
    'use strict'

    const eventsSubmit = ['app.record.edit.show', 'app.record.edit.change.']
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        const status = record.Status.value
        if (status === 'status2') {
            record.tableOption3.value[0].value.time.disabled = true
            return e
        }
    })
})()
