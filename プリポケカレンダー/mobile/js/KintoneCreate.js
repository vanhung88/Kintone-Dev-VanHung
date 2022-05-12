;(function () {
    'use strict'

    const eventsSubmit = [
        'mobile.app.record.create.show',
        'mobile.app.record.create.change.' + 'category',
    ]
    kintone.events.on(eventsSubmit, function (event) {
        const record = event.record
        const categoryValue = record.category.value
        switch_group(categoryValue)
    })
})()
