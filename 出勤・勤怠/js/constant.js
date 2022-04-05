// NO APP ID comment
const appId = 198

const disable_field = (record, fields) => {
    for (let field of fields) {
        record[field].disabled = true
    }
}

const body = {
    app: appId,
    query: 'Created_by in (LOGINUSER())',
    fields: [
        '$id',
        'user_login',
        'Created_by',
        'Created_datetime',
        'time_check_in',
        'time_check_out',
        'working_date',
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
            console.log(error)
        }
    )
})

const field_shown = (field, status) => {
    kintone.app.record.setFieldShown(field, status)
}

function display_field(fieldName) {
    for (const i of fieldName) {
        kintone.app.record.setFieldShown(i, false)
    }
}

const create_button = () => {
    if (document.getElementById('check-in-home') != null) {
        return
    } else {
        const CheckInAtHome = document.createElement('button')
        const CheckInAtOffice = document.createElement('button')
        const CheckOutButton = document.createElement('button')

        CheckInAtHome.id = 'check-in-home'
        CheckInAtOffice.id = 'check-in-office'
        CheckOutButton.id = 'check-out'

        CheckInAtHome.innerHTML = '始業（在宅）'
        CheckInAtOffice.innerHTML = '始業（出社）'
        CheckOutButton.innerHTML = '終業'

        CheckInAtHome.onclick = () => {
            const check = confirm('始業しますか？')
            const updateType = '始業（在宅）'
            if (check) {
                handleCheckIn2(updateType)
            }
        }
        CheckInAtOffice.onclick = () => {
            const check = confirm('始業しますか？')
            const updateType = '始業（出社）'
            if (check) {
                handleCheckIn2(updateType)
            }
        }
        CheckOutButton.onclick = () => {
            const check = confirm('終業しますか？')
            const updateType = '終業'
            if (check) {
                handleCheckOut2(updateType)
            }
        }
        kintone.app.getHeaderMenuSpaceElement().appendChild(CheckInAtHome)
        kintone.app.getHeaderMenuSpaceElement().appendChild(CheckInAtOffice)
        kintone.app.getHeaderMenuSpaceElement().appendChild(CheckOutButton)
    }
}

const useGetDate = (id) => {
    let unix_timestamp = Number(id)

    let date
    if (id.toString().length === 10) {
        date = new Date(unix_timestamp * 1000)
    } else {
        date = new Date(unix_timestamp)
    }

    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

    let month =
        date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1

    let year = date.getFullYear()

    let hours = date.getHours()

    let minutes =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    return {
        date: year + '-' + month + '-' + day,
        time: hours + ':' + minutes,
    }
}

const updateTime = (recordNumber, time, field, updateType) => {
    let update
    if (field === 'time_check_in') {
        update = {
            app: appId,
            id: recordNumber,
            record: {
                time_check_in: {
                    value: time,
                },
                Type: {
                    value: updateType,
                },
            },
        }
    } else {
        update = {
            app: appId,
            id: recordNumber,
            record: {
                time_check_out: {
                    value: time,
                },
                Type: {
                    value: updateType,
                },
            },
        }
    }
    kintone.api(
        kintone.api.url('/k/v1/record', true),
        'PUT',
        update,
        function (resp) {
            location.reload()
        },
        function (error) {
            console.log(error)
        }
    )
}

handleCheckIn2 = (updateType) => {
    let isCheckIn = false
    let updateTimeCheckIn = false

    kintone.api(
        kintone.api.url('/k/v1/records', true),
        'GET',
        body,
        function (resp) {
            const { date, time } = useGetDate(new Date(Date.now()).getTime())
            for (const e of resp.records) {
                if (e?.working_date?.value === date) {
                    if (e?.time_check_in?.value === null) {
                        updateTimeCheckIn = true
                        updateTime(
                            e.$id.value,
                            time,
                            'time_check_in',
                            updateType
                        )
                        break
                    } else isCheckIn = true
                    break
                }
            }

            if (updateTimeCheckIn) return

            // already checkIn
            if (isCheckIn) {
                alert(
                    'すでに出勤時刻を入力しております。レコード詳細から時刻を修正してください'
                )
            } else {
                const create = {
                    app: appId,
                    records: [
                        {
                            working_date: {
                                value: date, // year/,month/day
                            },
                            time_check_in: {
                                value: time, // hour:minute
                            },
                            Type: {
                                value: updateType, // dropdown value
                            },
                        },
                    ],
                }

                kintone.api(
                    kintone.api.url('/k/v1/records', true),
                    'POST',
                    create,
                    function (resp) {
                        location.reload()
                    },
                    function (error) {
                        console.log(error)
                    }
                )
            }
        },
        function (error) {
            console.log(error)
        }
    )
}

handleCheckOut2 = (updateType) => {
    let isCheckOut = false
    let updateTimeCheckOut = false

    kintone.api(
        kintone.api.url('/k/v1/records', true),
        'GET',
        body,
        function (resp) {
            const { date, time } = useGetDate(new Date(Date.now()).getTime())
            for (const value of resp.records) {
                if (value?.working_date?.value === date) {
                    isCheckOut = true
                    if (value?.time_check_out?.value === null) {
                        if (value?.time_check_in?.value !== null) {
                            updateTimeCheckOut = true
                            updateTime(
                                value?.$id?.value,
                                time,
                                'time_check_out',
                                updateType
                            )
                        } else {
                            alert('You have to check in before check out')
                            return
                        }
                    }
                    break
                }
            }

            if (updateTimeCheckOut) return

            // already checkIn
            if (isCheckOut) {
                alert(
                    'すでに退勤時刻が入力しております。レコード詳細から時刻を修正してください'
                )
            }
        },
        function (error) {
            console.log(error)
        }
    )
}
