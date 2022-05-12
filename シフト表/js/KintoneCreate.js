;(function () {
    'use strict'

    const eventSubmitSuccess = ['app.record.create.submit.success']
    kintone.events.on(eventSubmitSuccess, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        const loginName = record.name.value

        const appID = constant.appID

        const body = {
            app: appID,
            query: 'limit ' + 500 + ' offset ' + 0,
            fields: [
                '$id',
                'calendarDate',
                'category',
                'workingEmployee',
                'leaveEmployee',
            ],
        }

        const getListRecord = new Promise((resolve, reject) => {
            kintone.api(
                kintone.api.url('/k/v1/records', true),
                'GET',
                body,
                function (resp) {
                    resolve(resp.records)
                },
                function (error) {
                    reject()
                }
            )
        })

        getListRecord.then((records) => {
            for (let i = 0; i < recordTable.length; i++) {
                let arrRecord
                let employeeStatus = getEmployeeStatus(
                    recordTable[i].value.dropDown.value
                )
                let check = true
                let a
                const dateCol = recordTable[i].value.columnDate.value
                records.forEach((record) => {
                    if (
                        record.calendarDate.value === dateCol &&
                        record.category.value === 'シフト表'
                    ) {
                        arrRecord = record[employeeStatus].value.split('、')
                        check = false
                        a = record
                        arrRecord = [...arrRecord, loginName]
                    }
                })

                if (check && employeeStatus !== 'atHome') {
                    createRecord(appID, dateCol, employeeStatus, loginName)
                } else {
                    updateRecord(appID, a.$id.value, arrRecord, employeeStatus)
                }
            }
        })

        return e
    })

    const eventsSubmit2 = ['app.record.create.change.' + 'Table']
    kintone.events.on(eventsSubmit2, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        limitDate()
        disabledBtn(recordTable)
        autoGetMonth(record)
        dayError(record, e)

        return e
    })

    const eventsSubmit3 = ['app.record.create.change.' + 'columnDate']
    kintone.events.on(eventsSubmit3, function (e) {
        const record = e.record
        const recordTable = record.Table.value

        limitDate()
        disabledBtn(recordTable)
        dayError(record, e)

        return e
    })

    let check = true

    const eventsSubmit = [
        'app.record.create.show',
        'app.record.create.change.' + 'Table',
    ]

    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        console.log(record)
        const currentDate = new Date()

        const curYear = currentDate.getFullYear()
        const curMonth =
            currentDate.getMonth() + 1 < 10
                ? '0' + (currentDate.getMonth() + 1)
                : currentDate.getMonth() + 1
        if (check) {
            var mySpaceFieldButton = document.createElement('input')
            mySpaceFieldButton.id = 'yearMonthPicker'
            mySpaceFieldButton.type = 'month'
            mySpaceFieldButton.value = `${curYear}-${curMonth}`

            kintone.app.record
                .getSpaceElement('yearMonthPicker')
                .appendChild(mySpaceFieldButton)

            mySpaceFieldButton.onchange = function () {
                let arrDate = document.querySelectorAll(
                    '.input-date-text-cybozu'
                )
                const date = new Date(mySpaceFieldButton.value)
                const getYear = date.getFullYear()
                const getMonth =
                    +date.getMonth() + 1 < 10
                        ? '0' + (+date.getMonth() + 1)
                        : +date.getMonth() + 1
                arrDate.forEach((item) => {
                    // item.value = `${getMonth}/01/${getYear}`
                    item.value = `${getYear}-${getMonth}-01`
                    item.focus()
                    item.blur()
                })
            }
            check = false
        }
        let user = kintone.getLoginUser()
        record.name.value = user.name
        record.name.disabled = true

        document.querySelectorAll('.control-etc-gaia')[0].style.padding =
            '0 8px'
        limitDate()
        disabledBtn(recordTable)
        dayError(record, e)
        // autoGetMonth(record)
        return e
    })
})()
