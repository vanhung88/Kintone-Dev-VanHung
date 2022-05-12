;(function () {
    'use strict'
    kintone.events.on('app.record.edit.show', function (event) {
        set_field_down(initial_down_fields)
        set_field_disabled(event, initial_disabled_fields)
        var user = kintone.getLoginUser()
        const record = event.record
        console.log(record)
        const getName1 = record.決裁承認実行者.value[0].name
        const getName2 = record.立案実行者.value[0].name
        var tableRecords = event.record.捺印詳細.value[0].value.印章.value
        console.log(tableRecords)
        switch (event.record['ステータス']['value']) {
            case approval_route.route0:
                set_field_disabled(event, ['立案部署'])
                break
            case approval_route.route6:
                if (user.name === getName2) {
                    if (tableRecords !== 'なし' || tableRecords !== '角印') {
                        set_field_up(all_fields)
                    }
                }
                if (user.name !== getName1) {
                    set_field_down(all_fields)
                    set_field_up(attachment_fields_other)
                } else {
                    set_field_up(all_fields)
                }
                break
            case approval_route.route7:
            case approval_route.route8:
            case approval_route.route9:
                if (user.name !== getName) {
                    set_field_down(all_fields)
                    set_field_up(attachment_fields_other)
                } else {
                    set_field_up(all_fields)
                }
                break
            default:
                break
        }
        return event
    })

    kintone.events.on('app.record.edit.change.印章', function (event) {
        var tableRecords = event.record.捺印詳細.value
        let set_up_down_fields = ['押印確認実行者', '押印確認実行日']
        set_field_value(event, ['押印確認実行者'], [[]])
        set_field_down(set_up_down_fields)
        for (const i of tableRecords) {
            if (i.value['印章'].value !== 'なし') {
                set_field_up(set_up_down_fields)
                set_field_value(event, ['押印確認実行者'], [sealer])
                break
            }
        }
        return event
    })

    kintone.events.on('app.record.edit.change.LookUp会社名', function (event) {
        var record = event.record
        set_field_value(event, ['相手方'], [record.LookUp会社名.value])
        return event
    })
})()
