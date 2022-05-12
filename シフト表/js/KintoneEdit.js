;(function () {
    'use strict'

    const eventsSubmit = ['app.record.edit.submit.success']
    kintone.events.on(eventsSubmit, function (e) {
        // yearMonth, name, columnDate, dropDown, note
        const record = e.record
        const recordTable = record.Table.value

        const loginName = record.name.value

        limitDate()
        disabledBtn(recordTable)

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
                let arrRecord = []
                let newRecord = []
                const dateCol = recordTable[i].value.columnDate.value
                let employeeStatus = getEmployeeStatus(
                    recordTable[i].value.dropDown.value
                )
                let check = true
                let a
                records.forEach((record) => {
                    if (
                        record.calendarDate.value === dateCol &&
                        record.category.value === 'シフト表'
                    ) {
                        arrRecord = record[employeeStatus].value.split('、')
                        newRecord = arrRecord.filter(
                            (item) => item !== loginName
                        )
                        a = record
                        check = false
                    }
                })
                if (check) {
                    createRecord(appID, dateCol, employeeStatus, loginName)
                } else {
                    newRecord = [...newRecord, loginName]
                    updateRecord(appID, a.$id.value, newRecord, employeeStatus)
                }
            }
        })

        dayError(record, e)

        return e
    })

    const eventsSubmit2 = ['app.record.edit.change.' + 'yearMonth']
    kintone.events.on(eventsSubmit2, function (e) {
        const record = e.record

        autoGetMonth(record)

        return e
    })

    let check = true

    const eventsSubmit3 = ['app.record.edit.show']
    kintone.events.on(eventsSubmit3, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        const loginName = record.name.value
        let user = kintone.getLoginUser()
        record.name.value = user.name
        record.name.disabled = true
        document.querySelectorAll('.control-etc-gaia')[0].style.padding =
            '0 8px'
        if (check) {
            var mySpaceFieldButton = document.createElement('input')
            mySpaceFieldButton.id = 'yearMonthPicker'
            mySpaceFieldButton.type = 'month'
            const currentSelect = recordTable[0].value.columnDate.value
            const convertCurDate = new Date(currentSelect)
            const curYear = convertCurDate.getFullYear()
            const curMonth =
                convertCurDate.getMonth() + 1 < 10
                    ? '0' + (convertCurDate.getMonth() + 1)
                    : convertCurDate.getMonth() + 1
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
                const getMonth = +date.getMonth() + 1

                arrDate.forEach((item) => {
                    item.value = `${getMonth}/01/${getYear}`
                    // item.value = `${getYear}-${getMonth}-01`
                    item.focus()
                    item.blur()
                })
            }
            check = false
        }

        dayError(record, e)

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
            let newRecord = []
            for (let i = 0; i < recordTable.length; i++) {
                records.forEach((record) => {
                    let employeeStatus = getEmployeeStatus(
                        recordTable[i].value.dropDown.value
                    )
                    let currentRecord = record.workingEmployee.value.split('、')
                    let check = currentRecord.includes(loginName)
                    if (
                        check &&
                        record.category.value === 'シフト表' &&
                        employeeStatus === 'workingEmployee'
                    ) {
                        newRecord = currentRecord.filter(
                            (item) => item !== loginName
                        )
                        updateRecord(
                            appID,
                            record.$id.value,
                            newRecord,
                            employeeStatus
                        )
                    }
                })
            }
        })
        limitDate()
        disabledBtn(recordTable)
        dayError(record, e)
        // autoGetMonth(record)
        return e
    })

    const eventsSubmit4 = ['app.record.edit.change.' + 'Table']
    kintone.events.on(eventsSubmit4, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        limitDate()
        disabledBtn(recordTable)
        dayError(record, e)
        // autoGetMonth(record)
        return e
    })

    const eventsSubmit5 = ['app.record.edit.change.' + 'columnDate']
    kintone.events.on(eventsSubmit5, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        limitDate()
        disabledBtn(recordTable)
        dayError(record, e)
        return e
    })
})()
