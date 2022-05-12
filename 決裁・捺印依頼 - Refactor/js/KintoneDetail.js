;(function ($) {
    'use strict'

    // レコード詳細画面にて動作
    kintone.events.on('app.record.detail.show', function (event) {
        //$('.kintoneplugin-select-outer').css("display", "inline");
        //$('.pcreator-attachment-field-select option[value="決裁捺印依頼フォーマット"]').prop('selected',true);

        // ファイルの添付先フィールドの選択肢から以下を削除
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_1"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_2"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_3"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_4"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_5"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_6"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_7"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_8"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_9"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="捺印済み書類"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="捺印書類"]')
            .remove()
        $('.pcreator-attachment-field-select')
            .children('option[value="添付ファイル_10"]')
            .remove()

        // 添付ファイルの保存名フィールドの選択肢から以下を削除
        $('.pcreator-filename-field-select')
            .children('option[value="相手方"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="費用"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="捺印済み書類の保管先"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="捺印済み書類の保管先_エクスプローラー"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="BOXファイル保存名"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="AdobeSignリンク"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="LookUp会社名"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="取引先コード"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="立案No"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="部署ID"]')
            .remove()
        $('.pcreator-filename-field-select')
            .children('option[value="決裁捺印マニュアル"]')
            .remove()
    })

    kintone.events.on('app.record.detail.process.proceed', function (event) {
        var record = event.record
        var nStatus = event.nextStatus.value
        if (nStatus == '一次承認申請中' && record.立案No.value == '') {
            serial_number(event)
        }
        return event
    })

    function serial_number(event) {
        var recNo = 1
        var record = event.record
        //登録日付を入力
        var createDate = moment()
        var customerCodeFd = record['部署ID']['value']
        var queryStr =
            '部署ID = "' +
            customerCodeFd +
            '"order by 立案No desc limit 1&fields[0]=立案No'
        var appUrl =
            kintone.api.url('/k/v1/records', true) +
            '?app=' +
            kintone.app.getId() +
            '&query=' +
            encodeURI(queryStr)

        var xmlHttp = new XMLHttpRequest()

        // 同期リクエストを行う
        xmlHttp.open('GET', appUrl, false)
        xmlHttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xmlHttp.send(null)

        if (xmlHttp.status === 200) {
            if (window.JSON) {
                var obj = JSON.parse(xmlHttp.responseText)
                if (obj.records.length > 0) {
                    try {
                        //recNo = parseInt(obj.records[0]['取引先コード'].value, 10);
                        recNo =
                            parseInt(obj.records[0]['立案No'].value.slice(-3)) +
                            1
                        if (!recNo) {
                            recNo = 0
                        }
                    } catch (e) {
                        // event.error = '立案Noコードが取得できません。'
                        notification_error_warning(
                            'error',
                            '立案Noコードが取得できません。'
                        )
                    }
                }
                if (recNo <= 999) {
                    //自動採番を見積番号に設定する
                    var autoEstNo =
                        customerCodeFd + String(('000' + recNo).slice(-3))
                    alert('立案No ' + autoEstNo + ' を登録します。')
                    record['立案No']['value'] = autoEstNo
                } else {
                    // event.error =
                    //     customerCodeFd + 'の枝番の上限に達しています。'
                    const text = customerCodeFd + 'の枝番の上限に達しています。'
                    notification_error_warning('error', text)
                }
            } else {
                // event.error = xmlHttp.statusText
                notification_error_warning('error', xmlHttp.statusText)
            }
        } else {
            record['立案No'].error = '立案Noが取得できません。'
        }
        return event
    }

    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了

            if (!event.record.決裁捺印依頼書.value[0]) {
                var elVimeo = kintone.app.record.getSpaceElement('space1')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(event.record.決裁捺印依頼書.value[0], 'space1')
        }
    )

    // _/_/_/_/_/_/_/_/捺印済み書類_/_/_/_/_/_/_/_/_/_/_/
    // 捺印済み書類1
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[0] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[0],
                    'space1_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[0] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[0],
                    'space1_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space1_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類2
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[1] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[1],
                    'space2_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[1] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[1],
                    'space2_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space2_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類3
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[2] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[2],
                    'space3_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[2] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[2],
                    'space3_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space3_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類4
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[3] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[3],
                    'space4_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[3]) {
                printSealDocument(
                    event.record.捺印書類.value[3],
                    'space4_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space4_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類5
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[4] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[4],
                    'space5_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[4]) {
                printSealDocument(
                    event.record.捺印書類.value[4],
                    'space5_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space5_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類6
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[5] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[5],
                    'space6_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[5] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[5],
                    'space6_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space6_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類7
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[6] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[6],
                    'space7_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[6] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[6],
                    'space7_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space7_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類8
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[7] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[7],
                    'space8_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[7] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[7],
                    'space8_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space8_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類9
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[8] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[8],
                    'space9_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[8]) {
                printSealDocument(
                    event.record.捺印書類.value[8],
                    'space9_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space9_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類10
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[9] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[9],
                    'space10_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[9] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[9],
                    'space10_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space10_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類11
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[10] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[10],
                    'space11_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[10] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[10],
                    'space11_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space11_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類12
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[11] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[11],
                    'space12_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[11] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[11],
                    'space12_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space12_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類13
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[12] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[12],
                    'space13_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[12] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[12],
                    'space13_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space13_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類14
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[13] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[13],
                    'space14_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[13] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[13],
                    'space14_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space14_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // 捺印済み書類15
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (event.record.捺印済み書類.value[14] !== undefined) {
                printSealDocument(
                    event.record.捺印済み書類.value[14],
                    'space15_sealDocument'
                )
                return
            } else if (event.record.捺印書類.value[14] !== undefined) {
                printSealDocument(
                    event.record.捺印書類.value[14],
                    'space15_sealDocument'
                )
                return
            } else {
                var elVimeo = kintone.app.record.getSpaceElement(
                    'space15_sealDocument'
                )
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
        }
    )

    // _/_/_/_/_/_/_/_/添付書類_/_/_/_/_/_/_/_/_/_/_/
    //添付書類1
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_1.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space1_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_1.value[0],
                'space1_reference'
            )
        }
    )

    //添付書類2
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_2.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space2_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_2.value[0],
                'space2_reference'
            )
        }
    )

    //添付書類3
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_3.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space3_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_3.value[0],
                'space3_reference'
            )
        }
    )

    //添付書類4
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_4.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space4_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_4.value[0],
                'space4_reference'
            )
        }
    )

    //添付書類5
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_5.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space5_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_5.value[0],
                'space5_reference'
            )
        }
    )

    //添付書類6
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_6.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space6_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_6.value[0],
                'space6_reference'
            )
        }
    )

    //添付書類7
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_7.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space7_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_7.value[0],
                'space7_reference'
            )
        }
    )

    //添付書類8
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_8.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space8_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_8.value[0],
                'space8_reference'
            )
        }
    )

    //添付書類9
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_9.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space9_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_9.value[0],
                'space9_reference'
            )
        }
    )

    //添付書類10
    kintone.events.on(
        ['app.record.detail.show', 'app.record.print.show'],
        function (event) {
            // 「添付ファイル」が空だった場合に処理を終了
            if (!event.record.添付ファイル_10.value[0]) {
                var elVimeo =
                    kintone.app.record.getSpaceElement('space10_reference')
                elVimeo.parentNode.parentNode.style.display = 'none'
                return
            }
            printSealDocument(
                event.record.添付ファイル_10.value[0],
                'space10_reference'
            )
        }
    )
})(jQuery)
