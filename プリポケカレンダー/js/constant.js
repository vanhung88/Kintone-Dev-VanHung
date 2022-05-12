const appID = kintone.app.getId()

function field_shown(field, status) {
    kintone.app.record.setFieldShown(field, status)
}

function disabled_field(record, field, status) {
    record[field].disabled = status
}

function disabled_group(record, dropDownValue) {
    switch (dropDownValue) {
        default:
            disabled_field(record, 'workingEmployee', true)
            disabled_field(record, 'leaveEmployee', true)
            disabled_field(record, 'clientName', true)
            disabled_field(record, 'companyCode', true)
            disabled_field(record, 'customerCode', true)
            disabled_field(record, 'detail', true)
            disabled_field(record, 'calendarDate', true)
            disabled_field(record, 'category', true)
            break
    }
}

function switch_group(dropDownValue) {
    switch (dropDownValue) {
        case 'シフト表':
            field_shown('workingEmployee', true)
            field_shown('leaveEmployee', true)
            field_shown('clientName', false)
            field_shown('companyCode', false)
            field_shown('customerCode', false)
            field_shown('detail', false)
            break
        case 'サービス締日':
        case '入金日':
            field_shown('workingEmployee', false)
            field_shown('leaveEmployee', false)
            field_shown('clientName', true)
            field_shown('companyCode', true)
            field_shown('customerCode', true)
            field_shown('detail', false)
            break
        case 'リリース日':
            field_shown('workingEmployee', false)
            field_shown('leaveEmployee', false)
            field_shown('clientName', false)
            field_shown('companyCode', false)
            field_shown('customerCode', false)
            field_shown('detail', true)
            break
        default:
            field_shown('workingEmployee', false)
            field_shown('leaveEmployee', false)
            field_shown('clientName', false)
            field_shown('companyCode', false)
            field_shown('customerCode', false)
            field_shown('detail', false)
            break
    }
}

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

const updateRecord = (id, name, employeeStatus) => {
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

// const removeRecord = (record) => {
//     const recordTable = record.Table.value

//     const loginName = record.name.value

//     getListRecord.then((records) => {
//         records.forEach((record, index) => {
//             let employeeStatus = getEmployeeStatus(
//                 recordTable[index].value.dropDown.value
//             )

//             const dateCheck = recordTable[index].value.columnDate.value

//             if (
//                 record.calendarDate.value === dateCheck &&
//                 record.category.value === 'シフト表' &&
//                 record[employeeStatus].value === loginName
//             ) {
//                 updateRecord(record.$id.value, '', employeeStatus)
//             }
//         })
//     })
// }

// const createRecord = (date, employeeStatus, name) => {
//     var body = {
//         app: 17,
//         record: {
//             calendarDate: {
//                 value: date,
//             },
//             category: {
//                 value: 'シフト表',
//             },
//             [employeeStatus]: {
//                 value: name,
//             },
//         },
//     }

//     kintone.api(
//         kintone.api.url('/k/v1/record', true),
//         'POST',
//         body,
//         function (resp) {
//             // success
//         },
//         function (error) {
//             // error
//         }
//     )
// }
