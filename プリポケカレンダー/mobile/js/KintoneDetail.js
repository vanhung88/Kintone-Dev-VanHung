;(function () {
    'use strict'

    const eventsSubmit = ['mobile.app.record.detail.show']
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        const categoryValue = record.category.value
        switch_group(categoryValue)
    })
})()
