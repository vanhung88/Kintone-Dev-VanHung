function notification_error_warning(icon, error) {
    Swal.fire({
        icon,
        text: error,
    })
}

const dayError = (record, e) => {
    const saveBtn = document.querySelector('.gaia-ui-actionmenu-save')

    const allRecordTable = record.Table.value
    let check
    allRecordTable.forEach((item) => {
        const selectDate = item.value.columnDate.value
        const selectedDay = new Date(selectDate).getDay()
        if (selectedDay === 0 || selectedDay === 6) {
            notification_error_warning('error', 'その日付は営業日ではないです')
            // e.error = 'その日付は営業日ではないです'
            check = true
        }
    })

    const allSelectDate = document.querySelectorAll('.input-date-text-cybozu')
    for (let i = 0; i < allSelectDate.length - 1; i++) {
        for (let j = i + 1; j < allSelectDate.length; j++) {
            if (allSelectDate[i].value === allSelectDate[j].value) {
                notification_error_warning('error', '日付が重複されています。')
                // e.error = '日付が重複されています。'
                check = true
            }
        }
    }

    if (check) {
        saveBtn.style.pointerEvents = 'none'
    } else {
        saveBtn.style.pointerEvents = 'auto'
    }
}

const limitDate = () => {
    let selectDate = document.querySelectorAll('.input-date-cybozu')
    selectDate = Array.from(selectDate)

    selectDate.forEach((item, index) => {
        item.onclick = function (e) {
            let listItem = document.querySelectorAll(
                '.goog-date-picker-other-month'
            )
            listItem.forEach((item) => {
                item.style.pointerEvents = 'none'
            })
        }
    })
}

const disabledBtn = (recordTable) => {
    for (let i = 0; i < recordTable.length; i++) {
        const btnNext = document.querySelectorAll(
            '.goog-date-picker-nextMonth'
        )[i]
        const btnPre = document.querySelectorAll(
            '.goog-date-picker-previousMonth'
        )[i]
        const btnMonth = document.querySelectorAll(
            '.goog-date-picker-monthyear-area'
        )[i]

        btnNext.disabled = 'true'
        btnPre.disabled = 'true'
        btnMonth.style.pointerEvents = 'none'
    }
}

const autoGetMonth = (record) => {
    const selectDate = document.querySelectorAll('#yearMonthPicker')[0].value
    const date = new Date(selectDate)
    const getYear = date.getFullYear()
    const getMonth =
        +date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : +date.getMonth() + 1
    let getDay = 1
    const date2 = new Date(`${getYear}-${getMonth}-${getDay}`)
    if (date2.getDay() == 0 || date2.getDay() == 6) {
        getDay += 2
    }

    const recordTable = record.Table.value
    recordTable.forEach((item, index) => {
        if (index === recordTable.length - 1) {
            // item.value.columnDate.value = `${getMonth}/${getDay}/${getYear}`
            item.value.columnDate.value = `${getYear}-${getMonth}-${getDay}`
        }
    })
}

const getEmployeeStatus = (dropDownValue) => {
    let employeeStatus = ''
    if (
        dropDownValue === '出社' ||
        dropDownValue === '出社 (前半)' ||
        dropDownValue === '出社 (後半)'
    ) {
        employeeStatus = 'workingEmployee'
    } else if (
        dropDownValue === '休暇' ||
        dropDownValue === '休暇 (前半)' ||
        dropDownValue === '休暇 (後半)'
    ) {
        employeeStatus = 'leaveEmployee'
    } else {
        employeeStatus = 'atHome'
    }

    return employeeStatus
}

const body = {
    app: 99,
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

const updateRecord = (appID, id, name, employeeStatus) => {
    if (name[0] === '') {
        name.shift()
    }
    let loginName = name.join('、')

    const updateField = {
        app: appID,
        id,
        record: {
            [employeeStatus]: {
                value: loginName,
            },
        },
    }

    kintone.api(
        kintone.api.url('/k/v1/record', true),
        'PUT',
        updateField,
        function (resp) {},
        function (error) {}
    )
}

const removeRecord = (record) => {
    const recordTable = record.Table.value

    const loginName = record.name.value

    getListRecord.then((records) => {
        records.forEach((record, index) => {
            let employeeStatus = getEmployeeStatus(
                recordTable[index].value.dropDown.value
            )

            const dateCheck = recordTable[index].value.columnDate.value

            if (
                record.calendarDate.value === dateCheck &&
                record.category.value === 'シフト表' &&
                record[employeeStatus].value === loginName
            ) {
                updateRecord(appID, record.$id.value, '', employeeStatus)
            }
        })
    })
}

const createRecord = (appID, date, employeeStatus, name) => {
    var body = {
        app: appID,
        record: {
            calendarDate: {
                value: date,
            },
            category: {
                value: 'シフト表',
            },
            [employeeStatus]: {
                value: name,
            },
        },
    }

    kintone.api(
        kintone.api.url('/k/v1/record', true),
        'POST',
        body,
        function (resp) {
            // success
        },
        function (error) {
            // error
        }
    )
}
