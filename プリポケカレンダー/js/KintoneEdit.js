;(function () {
    'use strict'

    const eventsSubmit = [
        'app.record.edit.show',
        'app.record.edit.change.' + 'category',
    ]
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        record.calendarDate.disabled = true
        record.category.disabled = true
        record.workingEmployee.disabled = true
        record.leaveEmployee.disabled = true
        record.clientName.disabled = true
        record.companyCode.disabled = true
        record.customerCode.disabled = true
        record.detail.disabled = true
        const categoryValue = record.category.value
        switch_group(categoryValue)

        return e
    })
})()
