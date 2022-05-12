const approval_route_fields = ['立案実行者', '一次承認実行者', '決裁承認実行者']

const manage_planner = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '渡辺 健一',
    },
]

const sales_planner = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '人見 遼',
    },
]

const information_system_planner = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '望月 泉',
    },
]

const first_authorizer_not_manage = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '渡辺 健一',
    },
]

const first_authorizer_manage = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '人見 遼',
    },
]

const second_authorizer = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '田中 信',
    },
]

const sealer = [
    {
        code: 'mci-kintone-dev-admin@mc-fin.com',
        name: '渡辺 健一',
    },
]

const initial_down_fields = [
    'LookUp会社名',
    '部署ID',
    '押印確認実行者',
    '押印確認実行日',
]

const initial_disabled_fields = [
    '立案No',
    '立案実行日',
    '立案実行者',
    '一次承認実行者',
    '一次承認実行日',
    '決裁承認実行者',
    '決裁承認実行日',
    '押印確認実行者',
    '押印確認実行日',
    '捺印済み書類の保管先',
    '捺印済み書類の保管先_エクスプローラー',
    'BOXファイル保存名',
    'AdobeSignリンク',
]

const initial_create_values = {
    fields: [
        '立案日',
        '立案No',
        '立案実行日',
        '立案部署',
        '一次承認実行日',
        '決裁承認実行日',
        '押印確認実行日',
    ],
    values: ['', '', '', [], '', '', ''],
}

const approval_route = {
    route0: '稟議書未作成',
    route1: '立案依頼中',
    route2: '稟議書削除依頼',
    route3: '欠番',
    route4: '一次承認申請中',
    route5: '決裁申請中',
    route6: '承認済み',
    route7: '押印作業中',
    route8: '書類保管確認依頼中',
    route9: '完了',
}

const all_fields = [
    '立案日',
    '件名',
    '相手方',
    '決裁事項決裁事由',
    '費用',
    '資産計上',
    '予算区分',
    '予算外の場合',
    '捺印詳細',
    '押印確認者',
    '決裁捺印依頼書',
    '捺印書類',
    '捺印済み書類',
    '添付書類',
    '添付ファイル_1',
    '添付ファイル_2',
    '添付ファイル_3',
    '添付ファイル_4',
    '添付ファイル_5',
    '添付ファイル_6',
    '添付ファイル_7',
    '添付ファイル_8',
    '添付ファイル_9',
    '添付ファイル_10',
    '捺印後の書類郵送先など',
    '一次承認差し戻しテーブル',
    '決裁承認差し戻しテーブル',
    '立案実行者',
    '立案実行日',
    '一次承認実行者',
    '一次承認実行日',
    '決裁承認実行者',
    '決裁承認実行日',
    '押印確認実行者',
    '押印確認実行日',
    '捺印済み書類の保管先',
    '捺印済み書類の保管先_エクスプローラー',
    'BOX',
    'BOXファイル保存名',
    'リーガルチェック',
    '作成者',
    '作成日時',
    '更新者',
    '更新日時',
    'レコード番号',
    '取引先コード',
    'LookUp会社名',
    'AdobeSignリンク',
    '立案No',
    '部署ID',
    '立案部署',
]

const attachment_fields_other = [
    '添付書類',
    '添付ファイル_1',
    '添付ファイル_2',
    '添付ファイル_3',
    '添付ファイル_4',
    '添付ファイル_5',
    '添付ファイル_6',
    '添付ファイル_7',
    '添付ファイル_8',
    '添付ファイル_9',
    '添付ファイル_10',
]

function set_field_down(fields) {
    for (const i of fields) {
        kintone.app.record.setFieldShown(i, false)
    }
}

function set_field_up(fields) {
    for (const i of fields) {
        kintone.app.record.setFieldShown(i, true)
    }
}

function set_field_disabled(event, fields) {
    var record = event.record
    for (const i of fields) {
        record[i]['disabled'] = true
    }
    return event
}

function set_field_enable(event, fields) {
    var record = event.record
    for (const i of fields) {
        record[i]['disabled'] = false
    }
    return record
}

function set_field_value(event, set_fields, values) {
    var record = event.record
    let i = 0
    for (const field of set_fields) {
        record[field]['value'] = values[i]
        i += 1
    }
    return event
}

function separate(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
}

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
                        parseInt(obj.records[0]['立案No'].value.slice(-3)) + 1
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
                // alert('立案No ' + autoEstNo + ' を登録します。')
                const text = '立案No ' + autoEstNo + ' を登録します。'
                Swal.fire({
                    // Do you want to update the status -> ステータスを更新します。よろしいですか？
                    title: text,
                    showCancelButton: true,
                    cancelButtonText: 'キャンセル',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3498db',
                }).then((resp) => {
                    if (resp.isConfirmed) {
                        console.log('clicked OK')
                    }
                })
                record['立案No']['value'] = autoEstNo
            } else {
                // event.error = customerCodeFd + 'の枝番の上限に達しています。'
                const textErr = customerCodeFd + 'の枝番の上限に達しています。'
                notification_error_warning('error', textErr)
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

function setfileName(serialNumber, applicationSate, subject, applicant) {
    var fileName =
        serialNumber +
        '_' +
        applicationSate.substring(0, 4) +
        applicationSate.substring(5, 7) +
        applicationSate.substring(8, 10) +
        '_' +
        subject +
        '_' +
        applicant
    return fileName
}

function setApprovalDocument(document) {
    if (document === 0) {
        return false
    } else {
        return true
    }
}

function getNowYMD() {
    var dt = new Date()
    //kintone側でUTC→JPへ変換するためUTCで取得
    var y = dt.getUTCFullYear()
    var m = ('00' + (dt.getUTCMonth() + 1)).slice(-2)
    var d = ('00' + dt.getUTCDate()).slice(-2)
    var h = ('00' + dt.getUTCHours()).slice(-2)
    var mm = ('00' + dt.getUTCMinutes()).slice(-2)

    var result = y + '-' + m + '-' + d + 'T' + h + ':' + mm + ':' + '00' + 'Z'
    return result
}

// スピナーを動作させる関数
function showSpinner() {
    // 要素作成等初期化処理
    if ($('.kintone-spinner').length === 0) {
        // スピナー設置用要素と背景要素の作成
        var spin_div = $(
            '<div id ="kintone-spin" class="kintone-spinner"></div>'
        )
        var spin_bg_div = $(
            '<div id ="kintone-spin-bg" class="kintone-spinner"></div>'
        )

        // スピナー用要素をbodyにappend
        $(document.body).append(spin_div, spin_bg_div)

        // スピナー動作に伴うスタイル設定
        $(spin_div).css({
            position: 'fixed',
            top: '50%',
            left: '50%',
            'z-index': '510',
            'background-color': '#fff',
            padding: '26px',
            '-moz-border-radius': '4px',
            '-webkit-border-radius': '4px',
            'border-radius': '4px',
        })

        $(spin_bg_div).css({
            position: 'fixed',
            top: '0px',
            left: '0px',
            'z-index': '500',
            width: '100%',
            height: '200%',
            'background-color': '#000',
            opacity: '0.5',
            filter: 'alpha(opacity=50)',
            '-ms-filter': 'alpha(opacity=50)',
        })

        // スピナーに対するオプション設定
        var opts = {
            color: '#000',
        }

        // スピナーを作動
        new Spinner(opts).spin(document.getElementById('kintone-spin'))
    }

    // スピナー始動（表示）
    $('.kintone-spinner').show()
}

// スピナーを停止させる関数
function hideSpinner() {
    // スピナー停止（非表示）
    $('.kintone-spinner').hide()
}

function notification_error_warning(icon, error) {
    Swal.fire({
        icon,
        text: error,
        confirmButtonColor: '#3498db',
        errorButtonColor: '#3498db',
    })
}

// 詳細レコード下のプリントロジック
function printSealDocument(printDocument, spaceItem) {
    var xhr = new XMLHttpRequest()
    xhr.open(
        'GET',
        kintone.api.urlForGet(
            '/k/v1/file',
            { fileKey: printDocument.fileKey },
            true
        )
    )
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.responseType = 'blob'
    xhr.addEventListener('load', function () {
        pdfjsLib
            .getDocument(URL.createObjectURL(xhr.response))
            .promise.then(function (pdf) {
                Promise.all(
                    Array.apply(null, { length: pdf.numPages }).map(function (
                        value,
                        index
                    ) {
                        return pdf.getPage(index + 1)
                    })
                ).then(function (pages) {
                    // 要素を生成
                    var container = document.createElement('div')
                    var wrapper = document.createElement('div')
                    // スライドの表示サイズ
                    container.style.width = '1000px'
                    pages.forEach(function (page) {
                        // 要素を生成
                        var slide = document.createElement('div')
                        var canvas = document.createElement('canvas')
                        var viewport = page.getViewport({ scale: 1 })
                        // canvasの設定
                        canvas.width = viewport.width
                        canvas.height = viewport.height
                        canvas.style.width = '100%'
                        canvas.style.height = '100%'
                        page.render({
                            canvasContext: canvas.getContext('2d'),
                            viewport: viewport,
                        })
                        // slideの設定
                        slide.appendChild(canvas)
                        // wrapperの設定
                        wrapper.appendChild(slide)
                    })
                    // containerの設定
                    container.appendChild(wrapper)
                    // スペースフィールドを取得し、添付ファイルを展開
                    kintone.app.record
                        .getSpaceElement(spaceItem)
                        .appendChild(container)
                })
            })
    })
    xhr.send()
}
