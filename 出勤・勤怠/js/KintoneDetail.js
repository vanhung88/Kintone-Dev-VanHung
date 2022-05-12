;(function () {
    'use strict'

    const eventsSubmit = ['app.record.detail.show']
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        const hide_field = ['time_check_in', 'time_check_out']
        const user = kintone.getLoginUser()
        if (record.user_login.value[0].code !== user.code) {
            display_field(hide_field)
        }
    })
})()
