;(function () {
    'use strict'

    const eventsSubmit = ['app.record.detail.delete.submit']
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record
        const loginName = record.name.value

        const a = ['workingEmployee', 'leaveEmployee']

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
            records.forEach((record) => {
                a.forEach((item) => {
                    const arrRecord = record[item].value.split('、')
                    let newRecord = arrRecord.filter(
                        (item) => item !== loginName
                    )
                    updateRecord(appID, record.$id.value, newRecord, item)
                })
            })
        })
    })

    let check = true
    const eventsSubmit2 = ['app.record.detail.show']
    kintone.events.on(eventsSubmit2, function (e) {
        const record = e.record
        const recordTable = record.Table.value
        document.querySelectorAll('.control-etc-gaia')[0].style.padding =
            '0 8px'
        if (check) {
            var mySpaceFieldButton = document.createElement('input')
            mySpaceFieldButton.id = 'yearMonthPicker'
            mySpaceFieldButton.type = 'month'
            mySpaceFieldButton.disabled = true
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
    })
})()
