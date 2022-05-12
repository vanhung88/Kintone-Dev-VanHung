;(function () {
    'use strict'

    const eventsSubmit = ['app.record.index.show']
    kintone.events.on(eventsSubmit, function (e) {
        //code
        const appID = kintone.app.getId()

        const selectView = document.querySelectorAll(
            '.gaia-argoui-select-label'
        )[0].innerText

        if (selectView === '前払開始日‐締日') {
            const getTimeSheet = document.querySelectorAll(
                '.calendar-cell-body-gaia'
            )
            const getTimeSheet2 = document.querySelectorAll(
                '.calendar-record-gaia'
            )
            const arrRecords = Array.from(getTimeSheet)
            const arrRecords2 = Array.from(getTimeSheet2)
            arrRecords2.forEach((item) => {
                const getInner = item.querySelector('.cellitem-value-gaia')
                if (getInner.innerHTML === '----') {
                    item.style.display = 'none'
                }
            })

            const body = {
                app: appID,
                query: 'limit ' + 500 + ' offset ' + 0,
                fields: [
                    '$id',
                    'calendarDate',
                    'category',
                    'workingEmployee',
                    'leaveEmployee',
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
                    }
                )
            })

            getListRecord.then((records) => {
                const query = document.querySelectorAll(
                    '.input-text-outer-cybozu'
                )[0].baseURI
                const selectYearMonth =
                    query.split('=')[query.split('=').length - 1]
                const splitYearMonth = selectYearMonth.split('-')
                let selectYear = splitYearMonth[0]
                let selectMonth = splitYearMonth[1]
                let dayOfMonth = new Date(selectYear, selectMonth, 0).getDate()
                const date = new Date()
                if (isNaN(dayOfMonth)) {
                    selectYear = date.getFullYear()
                    selectMonth =
                        +date.getMonth() + 1 < 10
                            ? '0' + (+date.getMonth() + 1)
                            : +date.getMonth() + 1
                    dayOfMonth = new Date(selectYear, selectMonth, 0).getDate()
                }

                records.forEach((record) => {
                    for (let i = 1; i <= dayOfMonth; i++) {
                        let formatDay = i < 10 ? '0' + i : i

                        const item = document.getElementById(
                            `${selectYear}-${selectMonth}-${formatDay}-calendar-gaia`
                        )
                        if (
                            record.calendarDate.value ===
                                `${selectYear}-${selectMonth}-${formatDay}` &&
                            record.category.value === 'シフト表'
                        ) {
                            let htmls

                            if (`${record.workingEmployee.value}`) {
                                htmls = `<ul class="calendar-cell-body-list-gaia">
                                            <li class="calendar-record-gaia cellitem-singlelinetext-gaia ">
                                                <a href="/k/${appID}/show#record=${record.$id.value}&amp;l.date=${selectYear}-${selectMonth}&amp;l.view=5542158&amp;l.q&amp;l.sort_0=f5542079&amp;l.order_0=ASC&amp;l.sort_1=f5542000&amp;l.order_1=DESC">
                                                    <span class="cellitem-value-gaia">${record.workingEmployee.value}</span>
                                                </a>
                                            </li>
                                        </ul>`
                            } else {
                                htmls = `<ul class="calendar-cell-body-list-gaia">
                            
                                        </ul>`
                            }
                            item.querySelector(
                                '.calendar-cell-body-gaia'
                            ).innerHTML = htmls
                        }
                    }
                })
            })

            const tooltip = document.querySelectorAll(
                '.calendar-tooltip-content-gaia'
            )
            const arrTooltip = Array.from(tooltip)
            arrTooltip.forEach((item) => {
                const itemLength = item.getElementsByTagName('li').length
                if (
                    itemLength === 1 &&
                    item.getElementsByTagName('li')[0].innerText === '----'
                ) {
                    item.remove()
                }
            })
        } else {
            let view_list = document.getElementById('view-list-data-gaia')
            let firstTable = view_list.querySelectorAll('table')[0]
            view_list.style.minWidth = '100vw'
            firstTable.style.minWidth = '100%'
            // firstTable.style.width = 'auto'
            let th_kintone = view_list.querySelectorAll('th')

            // th_kintone[3].minWidth = '100%'
            // th_kintone[4].minWidth = '100%'
            // th_kintone[5].minWidth = '100%'
            // th_kintone[6].minWidth = '100%'
            // th_kintone[7].minWidth = '100%'
            // th_kintone[8].minWidth = '100%'
            // th_kintone[9].minWidth = '200%'

            // th_kintone[3].style.width = '100%'
            // th_kintone[4].style.width = '100%'
            // th_kintone[5].style.width = '100%'
            // th_kintone[6].style.width = '100%'
            // th_kintone[7].style.width = '100%'
            // th_kintone[8].style.width = '100%'
            // th_kintone[9].style.width = '100%'

            let wrapCol = document.querySelectorAll(
                '.line-cell-gaia.recordlist-ellipsis-gaia'
            )

            const arrWrapCol = Array.from(wrapCol)
            arrWrapCol.forEach((item) => {
                item.getElementsByTagName('span')[0].style.whiteSpace = 'unset'
            })

            const tdWrap = document.querySelectorAll('.recordlist-cell-gaia')
            tdWrap.forEach((item) => {
                item.style.whiteSpace = 'unset'
            })
        }
    })

    const eventsSubmit2 = ['app.record.index.edit.show']
    kintone.events.on(eventsSubmit2, function (e) {
        const record = e.record
        const categoryValue = record.category.value
        disabled_group(record, categoryValue)

        return e
    })
})()
