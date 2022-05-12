;(function () {
    'use strict'
    kintone.events.on('app.record.create.show', function (event) {
        set_field_down(initial_down_fields)
        event = set_field_disabled(event, initial_disabled_fields)
        set_field_value(
            event,
            initial_create_values.fields,
            initial_create_values.values
        )
        return event
    })

    kintone.events.on(
        'app.record.create.change.LookUp会社名',
        function (event) {
            var record = event.record
            set_field_value(event, ['相手方'], [record.LookUp会社名.value])
            return event
        }
    )

    kintone.events.on('app.record.create.change.印章', function (event) {
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

    kintone.events.on('app.record.create.change.立案部署', function (event) {
        var record = event.record
        if (record['立案部署']['value'].length === 1) {
            switch (record['立案部署']['value'][0].name) {
                case '社長':
                    set_field_value(event, approval_route_fields, [
                        manage_planner,
                        first_authorizer_manage,
                        second_authorizer,
                    ])
                    break
                case '営業部':
                    set_field_value(event, approval_route_fields, [
                        manage_planner,
                        first_authorizer_manage,
                        second_authorizer,
                    ])
                    break
                case '管理部長':
                    set_field_value(event, approval_route_fields, [
                        manage_planner,
                        first_authorizer_manage,
                        second_authorizer,
                    ])
                    break
                case '管理部':
                    set_field_value(event, approval_route_fields, [
                        sales_planner,
                        first_authorizer_not_manage,
                        second_authorizer,
                    ])
                    break
                case '営業部長':
                    set_field_value(event, approval_route_fields, [
                        information_system_planner,
                        first_authorizer_not_manage,
                        second_authorizer,
                    ])
                    break
                default:
                    set_field_value(event, approval_route_fields, [[], [], []])
                    break
            }
        } else if (record['立案部署']['value'].length > 1) {
            set_field_value(event, ['立案部署'], [[]])
            set_field_value(event, approval_route_fields, [[], [], []])
            // Swal.fire({
            //     text: '立案部署は１つしか選択できません。',
            //     icon: 'error',
            //     errorButtonColor: '#3498db',
            //     confirmButtonColor: '#3498db',
            //     allowOutsideClick: false,
            // })
            Swal.fire({
                icon: 'error',
                text: '立案部署は１つしか選択できません。',
                errorButtonColor: '#3498db',
            })
        } else {
            set_field_value(event, approval_route_fields, [[], [], []])
        }
        return event
    })

    kintone.events.on('app.record.create.change.費用', function (event) {
        var intValue = 0
        if (event.record['費用'].value !== undefined) {
            intValue = event.record['費用'].value.replace(
                /[Ａ-Ｚａ-ｚ０-９]/g,
                function (s) {
                    return String.fromCharCode(s.charCodeAt(0) - 65248)
                }
            )
            set_field_value(event, ['費用'], [separate(intValue)])
        }
        return event
    })
})()
