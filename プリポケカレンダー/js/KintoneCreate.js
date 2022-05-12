;(function () {
    'use strict'

    const eventsSubmit = [
        'app.record.create.show',
        'app.record.create.change.' + 'category',
    ]
    kintone.events.on(eventsSubmit, function (event) {
        const record = event.record

        const categoryValue = record.category.value
        switch_group(categoryValue)

        return event
    })

    const eventsSubmit2 = ['app.record.create.submit.success']
    kintone.events.on(eventsSubmit2, function (event) {
        const record = event.record
        const appID = kintone.app.getId()
        const url = kintone.api.url('/k/v1/records')
        let chooseDate = record.calendarDate.value
        let workingEmployee
        let leaveEmployee
        const arrEmployee = ['workingEmployee', 'leaveEmployee']

        if (record.category.value === 'シフト表') {
            arrEmployee.forEach((item) => {
                if (record.workingEmployee.value) {
                    workingEmployee = record[item].value
                }
                if (record.leaveEmployee.value) {
                    leaveEmployee = record[item].value
                }
            })
        }

        getListRecord.then((records) => {
            records.forEach((item) => {
                const calendarDate = item.calendarDate.value
                const category = item.category.value

                if (
                    chooseDate === calendarDate &&
                    category === 'シフト表' &&
                    record.category.value === 'シフト表'
                ) {
                    arrEmployee.forEach((arrEm) => {
                        if (record[arrEm].value) {
                            let listValue = item[arrEm].value
                            let a = listValue.split('、')
                            let newRec = [...a, `${record[arrEm].value}`]
                            updateRecord(item.$id.value, newRec, arrEm)
                        }
                    })
                    if (url.includes('kuq')) {
                        window.location.href = `https://kuq3lqf45lgn.cybozu.com/k/${appID}`
                    } else {
                        window.location.href = `https://b60ixfwf5prx.cybozu.com/k/${appID}`
                    }

                    let body = {
                        app: appID,
                        ids: [record.$id.value],
                    }

                    kintone.api(
                        kintone.api.url('/k/v1/records', true),
                        'DELETE',
                        body,
                        function (resp) {
                            // success
                            console.log(resp)
                        },
                        function (error) {
                            // error
                            console.log(error)
                        }
                    )
                }
            })
        })

        return event
    })
})()
