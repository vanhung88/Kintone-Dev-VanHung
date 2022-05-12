// NO APP ID comment
// const appId = 198
// appID = 75 // dev

const disable_field = (record, fields) => {
    for (let field of fields) {
        record[field].disabled = true
    }
}

// const body = {
//     app: appId,
//     query: 'Created_by in (LOGINUSER())',
//     fields: [
//         '$id',
//         'user_login',
//         'Created_by',
//         'Created_datetime',
//         'time_check_in',
//         'time_check_out',
//         'working_date',
//     ],
// }

// const getListRecord = new Promise((resolve, reject) => {
//     kintone.api(
//         kintone.api.url('/k/v1/records', true),
//         'GET',
//         body,
//         function (resp) {
//             resolve(resp.records)
//         },
//         function (error) {
//             reject()
//             console.log(error)
//         }
//     )
// })

const field_shown = (field, status) => {
    kintone.app.record.setFieldShown(field, status)
}

function display_field(fieldName) {
    for (const i of fieldName) {
        kintone.app.record.setFieldShown(i, false)
    }
}

const create_button = (appID) => {
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
            Swal.fire({
                // Do you want to update the status -> ステータスを更新します。よろしいですか？
                title: '在宅勤務を開始しますか？',
                showCancelButton: true,
                cancelButtonText: 'キャンセル',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3498db',
            }).then((resp) => {
                if (resp.isConfirmed) {
                    const updateType = '始業（在宅）'
                    handleCheckIn2(appID, updateType)
                }
            })
            // const check = confirm('始業しますか？')
            // if (check) {
            // }
        }
        CheckInAtOffice.onclick = () => {
            Swal.fire({
                // Do you want to update the status -> ステータスを更新します。よろしいですか？
                title: '出社を開始しますか？',
                showCancelButton: true,
                cancelButtonText: 'キャンセル',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3498db',
            }).then((resp) => {
                if (resp.isConfirmed) {
                    const updateType = '始業（出社）'
                    handleCheckIn2(appID, updateType)
                }
            })
            // const check = confirm('始業しますか？')
            // const updateType = '始業（出社）'
            // if (check) {
            //     handleCheckIn2(appID, updateType)
            // }
        }
        CheckOutButton.onclick = () => {
            Swal.fire({
                // Do you want to update the status -> ステータスを更新します。よろしいですか？
                title: '退勤しますか？',
                showCancelButton: true,
                cancelButtonText: 'キャンセル',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3498db',
            }).then((resp) => {
                if (resp.isConfirmed) {
                    const updateType = '終業'
                    handleCheckOut2(appID, updateType)
                }
            })
            // const check = confirm('終業しますか？')
            // const updateType = '終業'
            // if (check) {
            //     handleCheckOut2(appID, updateType)
            // }
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

const updateTime = (appID, recordNumber, time, field, updateType) => {
    let update
    if (field === 'time_check_in') {
        update = {
            app: appID,
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
            app: appID,
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

handleCheckIn2 = (appID, updateType) => {
    let isCheckIn = false
    let updateTimeCheckIn = false

    const body = {
        app: appID,
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
                            appID,
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
                Swal.fire({
                    icon: 'warning',
                    text: 'すでに出勤時刻を入力しております。レコード詳細から時刻を修正してください',
                    confirmButtonColor: '#3498db',
                })
                // alert(
                //     'すでに出勤時刻を入力しております。レコード詳細から時刻を修正してください'
                // )
            } else {
                const create = {
                    app: appID,
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

handleCheckOut2 = (appID, updateType) => {
    let isCheckOut = false
    let updateTimeCheckOut = false

    const body = {
        app: appID,
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
                                appID,
                                value?.$id?.value,
                                time,
                                'time_check_out',
                                updateType
                            )
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                text: 'You have to check in before check out',
                                confirmButtonColor: '#3498db',
                            })
                            // alert('You have to check in before check out')
                            return
                        }
                    }
                    break
                }
            }

            if (updateTimeCheckOut) return

            // already checkIn
            if (isCheckOut) {
                Swal.fire({
                    icon: 'warning',
                    text: 'すでに退勤時刻が入力しております。レコード詳細から時刻を修正してください',
                    confirmButtonColor: '#3498db',
                })
                // alert(
                //     'すでに退勤時刻が入力しております。レコード詳細から時刻を修正してください'
                // )
            }
        },
        function (error) {
            console.log(error)
        }
    )
}
