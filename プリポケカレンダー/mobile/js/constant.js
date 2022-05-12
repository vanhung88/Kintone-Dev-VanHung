function field_shown(field, status) {
    kintone.mobile.app.record.setFieldShown(field, status)
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
