;(function () {
    'use strict'

    const eventsSubmit = [
        'mobile.app.record.edit.show',
        'mobile.app.record.edit.change.' + 'category',
    ]
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        const categoryValue = record.category.value
        switch_group(categoryValue)
    })
})()
