;(function () {
    'use strict'

    const eventsSubmit = [
        'app.record.create.show',
        'app.record.create.change.' + 'dropDown',
    ]
    kintone.events.on(eventsSubmit, function (event) {
        // dropDown, fieldGroup, textField, groupSelection, tableOption1, tableOption2, tableOption3
        const record = event.record
        const dropDownValue = record.dropDown.value
        switch (dropDownValue) {
            case 'option 1':
                field_shown('tableOption2', false)
                field_shown('tableOption3', false)
                field_shown('tableOption1', true)
                field_shown('fieldGroup', true)
                break
            case 'option 2':
                field_shown('tableOption1', false)
                field_shown('tableOption3', false)
                field_shown('tableOption2', true)
                field_shown('fieldGroup', true)
                break
            case 'option 3':
                field_shown('tableOption1', false)
                field_shown('tableOption2', false)
                field_shown('tableOption3', true)
                field_shown('fieldGroup', true)
                break
            default:
                field_shown('tableOption1', false)
                field_shown('tableOption2', false)
                field_shown('tableOption3', false)
                field_shown('fieldGroup', false)
                break
        }

        let firstnameButton = document.createElement('button')
        firstnameButton.innerHTML = 'Ho'
        firstnameButton.addEventListener('click', (e) => {
            document.getElementById('31_5533932-:1t-text').value = 'Nguyen'
            record.firstname.value = 'Nguyen'
        })
        kintone.app.record
            .getHeaderMenuSpaceElement()
            .appendChild(firstnameButton)

        let lastnameButton = document.createElement('button')
        lastnameButton.innerHTML = 'Ten'
        lastnameButton.addEventListener('click', (e) => {
            document.getElementById('31_5533933-:1u-text').value = 'Duc'
            record.lastname.value = 'Duc'
        })
        kintone.app.record
            .getHeaderMenuSpaceElement()
            .appendChild(lastnameButton)
    })
})()
