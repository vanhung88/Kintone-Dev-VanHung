;(function () {
    'use strict'

    const eventsSubmit = ['app.record.index.edit.show', 'app.record.index.show']
    kintone.events.on(eventsSubmit, function (e) {
        console.log(e)
        console.log('start 23')
        const addValue = () => {
            var body = {
                app: 225,
                record: {
                    firstname: {
                        value: 'a',
                    },
                    lastname: {
                        value: 'b',
                    },
                },
            }

            kintone.api(
                kintone.api.url('/k/v1/record', true),
                'POST',
                body,
                function (resp) {
                    // success
                    location.reload()
                    console.log(resp)
                },
                function (error) {
                    // error
                    console.log(error)
                }
            )
        }
        let lastnameButton = document.createElement('button')
        lastnameButton.innerHTML = 'add record'
        lastnameButton.addEventListener('click', (e) => {
            addValue()
        })

        kintone.app.getHeaderSpaceElement().appendChild(lastnameButton)
    })
})()
