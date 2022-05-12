;(function () {
    'use strict'
    // ロケールを設定
    moment.locale('ja')

    var events = ['app.record.detail.process.proceed']

    // プロセスが変更されたタイミングで、実行者と日時を保存
    kintone.events.on(events, function (event) {
        var record = event.record
        console.log(record)
        var nStatus = event.nextStatus.value
        if (nStatus == '一次承認申請中' && record.立案No.value == '') {
            serial_number(event)
        }
        var user = kintone.getLoginUser()
        var datetime = moment().format('YYYY-MM-DD HH:mm')
        var seal_details = record.捺印詳細.value
        //マニュアルのURL
        // 稟議書作成社マニュアル
        const authorManual =
            'https://mci-portal.cybozu.com/k/72/show#record=34&l.view=2169&l.q&l.sort_0=f2160&l.order_0=DESC&l.next=33&l.prev=35'
        // 立案者マニュアル
        const plannerManual =
            'https://mci-portal.cybozu.com/k/72/show#record=34&l.view=2169&l.q&l.sort_0=f2160&l.order_0=DESC&l.next=33&l.prev=35'
        // 一次承認者マニュアル
        const firstAuthorizerManual =
            'https://mci-portal.cybozu.com/k/72/show#record=35&l.view=2169&l.q&l.sort_0=f2160&l.order_0=DESC&l.next=34&l.prev=36'
        // 決裁者マニュアル
        const lastAuthorizerManual =
            'https://mci-portal.cybozu.com/k/72/show#record=36&l.view=2169&l.q&l.sort_0=f2160&l.order_0=DESC&l.next=35&l.prev=37'
        // 押印確認者マニュアル
        const confirmerManual =
            'https://mci-portal.cybozu.com/k/72/show#record=37&l.view=2169&l.q&l.sort_0=f2160&l.order_0=DESC&l.next=36&l.prev=38'
        // 管理部マニュアル
        const adminManual =
            'https://mci-portal.cybozu.com/k/72/show#record=38&l.view=2169&l.q&l.sort_0=f2160&l.order_0=DESC&l.next=37&l.prev=0'

        // 稟議書作成した時のアクション
        if (nStatus == '立案依頼中') {
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }

            if (
                record.捺印書類.value.length === 0 &&
                record.捺印詳細.value[0].value.印章.value !== 'なし'
            ) {
                console.log(1)
                notification_error_warning(
                    'error',
                    '捺印書類が添付されていません。'
                )
            } else if (
                record.捺印書類.value.length !== 0 &&
                record.捺印詳細.value[0].value.印章.value === 'なし'
            ) {
                // event.error = '印章なしで捺印書類が添付されています。'
                console.log(2)

                notification_error_warning(
                    'error',
                    '印章なしで捺印書類が添付されています。'
                )
            }

            for (const seal_details_item of seal_details) {
                if (
                    seal_details_item.value.印章.value !== 'なし' &&
                    (String(seal_details_item.value.捺印書類名.value).trim() ==
                        '' ||
                        String(seal_details_item.value.捺印数.value).trim() ==
                            '' ||
                        String(seal_details_item.value.部数.value).trim() ==
                            '' ||
                        String(seal_details_item.value.計.value).trim() == '')
                ) {
                    // event.error = '捺印書詳細で未入力項目があります。'
                    notification_error_warning(
                        'error',
                        '捺印書詳細で未入力項目があります。'
                    )
                }
            }

            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = plannerManual
            }
            return event
        }
        // 立案した時のアクション
        if (nStatus == '一次承認申請中') {
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }

            record.立案実行者.value = [{ code: user.code, name: user.name }]
            record.立案実行日.value = moment(datetime).toISOString()
            record.BOXファイル保存名.value = setfileName(
                record.立案No.value,
                record.立案実行日.value,
                record.件名.value,
                record.立案部署.value[0].name
            )

            if (
                record.捺印書類.value.length === 0 &&
                record.捺印詳細.value[0].value.印章.value !== 'なし'
            ) {
                console.log(3)

                notification_error_warning(
                    'error',
                    '捺印書類が添付されていません。'
                )
            } else if (
                record.捺印書類.value.length !== 0 &&
                record.捺印詳細.value[0].value.印章.value === 'なし'
            ) {
                // event.error = '印章なしで捺印書類が添付されています。'
                notification_error_warning(
                    'error',
                    '印章なしで捺印書類が添付されています。'
                )
            }

            if (record.捺印詳細.value[0].value.印章.value == 'なし') {
                record.押印確認実行者.value = []
            }

            for (const seal_details_item of seal_details) {
                if (
                    seal_details_item.value.印章.value !== 'なし' &&
                    (String(seal_details_item.value.捺印書類名.value).trim() ==
                        '' ||
                        String(seal_details_item.value.捺印数.value).trim() ==
                            '' ||
                        String(seal_details_item.value.部数.value).trim() ==
                            '' ||
                        String(seal_details_item.value.計.value).trim() == '')
                ) {
                    // event.error = '捺印書詳細で未入力項目があります。'
                    notification_error_warning(
                        'error',
                        '捺印書詳細で未入力項目があります。'
                    )
                }
            }

            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = firstAuthorizerManual
            }
            return event
        }

        // 一次承認した時のアクション handle status 6
        if (nStatus == '決裁申請中') {
            record.一次承認実行者.value = [{ code: user.code, name: user.name }]
            record.一次承認実行日.value = moment(datetime).toISOString()
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }

            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = lastAuthorizerManual
            }
            return event
        }

        // 決裁承認した時のアクション
        if (nStatus == '承認済み') {
            record.決裁承認実行者.value = [{ code: user.code, name: user.name }]
            record.決裁承認実行日.value = moment(datetime).toISOString()
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }

            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = plannerManual
            }
            return event
        }

        // handle status 8
        if (nStatus == '捺印済書類添付') {
            record.決裁承認実行者.value = [{ code: user.code, name: user.name }]
            record.決裁承認実行日.value = moment(datetime).toISOString()
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }
            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = plannerManual
            }

            // option 2,3,5 : if belong 2,3,5 => check
            if (record?.捺印詳細.value[0].value.印章.value !== '印章') {
                if (record?.捺印済み書類?.value?.length === 0) {
                    // event.error =
                    //     '捺印済み書類を添付しなければ次のステータスに進めない'
                    // show err
                    notification_error_warning(
                        'error',
                        '捺印済み書類を添付しなければ次のステータスに進めない'
                    )
                }
            }
            return event
        }

        // handle status 9
        if (nStatus == '押印作業中') {
            record.決裁承認実行者.value = [{ code: user.code, name: user.name }]
            record.決裁承認実行日.value = moment(datetime).toISOString()

            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }
            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = confirmerManual
            }
            return event
        }

        if (nStatus == '押印作業中') {
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }
            // if (record.捺印済み書類.value.length === 0) {
            //   event.error = '捺印済み書類が添付されていません。';
            // }
            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = confirmerManual
            }
            return event
        }

        // 押印確認した時のアクション
        if (nStatus == '押印確認済み') {
            record.押印確認実行者.value = [{ code: user.code, name: user.name }]
            record.押印確認実行日.value = moment(datetime).toISOString()
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書を添付することができません。'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書を添付することができません。'
                )
            }
            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = plannerManual
            }
            return event
        }

        // 差し戻しされた時はすべてのステータスを空欄に戻す
        if (nStatus == '差し戻し') {
            record.立案実行日.value = null
            record.一次承認実行日.value = null
            record.決裁承認実行日.value = null
            record.押印確認実行日.value = null
            record.決裁捺印マニュアル.value = authorManual
            return event
        }

        if (nStatus == '書類保管依頼中') {
            if (
                setApprovalDocument(record.決裁捺印依頼書.value.length) ===
                false
            ) {
                // event.error = '決裁・捺印依頼書が出力されていません'
                notification_error_warning(
                    'error',
                    '決裁・捺印依頼書が出力されていません'
                )
            }
            if (event.error === undefined) {
                record.決裁捺印マニュアル.value = adminManual
            }
            return event
        }

        let mail = kintone.getLoginUser().email
        let app = kintone.app.getId()
        let recodeId = event.record.$id.value

        if (event.action.value == '一次承認差し戻し') {
            var result = prompt('一次承認の差し戻し理由を入力してください。')
            if (result === null || result.length === 0) {
                var body = {
                    app: app,
                    id: recodeId,
                    action: '再申請する',
                    assignee: mail,
                }
                showSpinner() // スピナー表示
                kintone.api(
                    kintone.api.url('/k/v1/record/status', true),
                    'PUT',
                    body,
                    function (resp) {
                        // success
                        //console.log(resp);
                        location.reload()
                    },
                    function (error) {
                        // error
                        hideSpinner()
                        alert(
                            'プロセスのロールバックに失敗しました。リロードして確認してください。'
                        )
                        console.log(error)
                    }
                )
                return
            }
            var rows = event.record.一次承認差し戻しテーブル.value
            if (rows.length === 1) {
                //デフォルトで存在する空のrowを更新する。
                if (rows[0].value.一次承認差し戻し内容.value.length === 0) {
                    event.record.一次承認差し戻しテーブル.value.forEach(
                        function (row) {
                            row.value.一次承認差し戻し内容.value = result
                            row.value.一次承認差し戻し日時.value = getNowYMD()
                        }
                    )
                    kintone.app.record.set({ record: event.record })
                    return event
                }
            }
            event.record.一次承認差し戻しテーブル.value.push({
                value: {
                    一次承認差し戻し日時: {
                        value: getNowYMD(),
                        type: 'DATETIME',
                    },
                    一次承認差し戻し内容: {
                        value: result,
                        type: 'MULTI_LINE_TEXT',
                    },
                },
            })
            kintone.app.record.set({ record: event.record })
        }
        if (event.action.value == '決裁承認差し戻し') {
            result = prompt('決裁承認の差し戻し理由を入力してください。')
            if (result === null || result.length === 0) {
                body = {
                    app: app,
                    id: recodeId,
                    action: '再申請する',
                    assignee: mail,
                }
                showSpinner() // スピナー表示
                kintone.api(
                    kintone.api.url('/k/v1/record/status', true),
                    'PUT',
                    body,
                    function (resp) {
                        // success
                        //console.log(resp);
                        location.reload()
                    },
                    function (error) {
                        // error
                        hideSpinner()
                        alert(
                            'プロセスのロールバックに失敗しました。リロードして確認してください。'
                        )
                        console.log(error)
                    }
                )
                return
            }
            rows = event.record.決裁承認差し戻しテーブル.value
            if (rows.length === 1) {
                //デフォルトで存在する空のrowを更新する。
                if (rows[0].value.決裁承認差し戻し内容.value.length === 0) {
                    event.record.決裁承認差し戻しテーブル.value.forEach(
                        function (row) {
                            row.value.決裁承認差し戻し内容.value = result
                            row.value.決裁承認差し戻し日時.value = getNowYMD()
                        }
                    )
                    kintone.app.record.set({ record: event.record })
                    return event
                }
            }
            event.record.決裁承認差し戻しテーブル.value.push({
                value: {
                    決裁承認差し戻し日時: {
                        value: getNowYMD(),
                        type: 'DATETIME',
                    },
                    決裁承認差し戻し内容: {
                        value: result,
                        type: 'MULTI_LINE_TEXT',
                    },
                },
            })
            kintone.app.record.set({ record: event.record })
        }
        return event
    })
})()
