
(function () {
    "use strict";
    
    const dropDown = "type_cost"; //field code of radio button field
    const taxiGroup4_2 = "taxi_gr4_2";
    const radioButton = "Radio_button";
    
    
    const eventsSubmit = ['app.record.index.edit.show',
    'app.record.index.show',
    'app.record.index.edit.change.'+dropDown,
    'app.record.index.edit.change.'+radioButton,
    'app.record.index.edit.change.'+taxiGroup4_2,
];
kintone.events.on(eventsSubmit, function(e) {
    const record = e.record;
    const rowTableE = document.querySelectorAll('.recordlist-row-gaia')
    const optionView = document.querySelector('.gaia-argoui-select-label').textContent;
    const calculated = document.querySelectorAll('.recordlist-forms-label-gaia')
    const dropDownValue = rowTableE[0].querySelector('.recordlist-single_select-gaia').querySelector('span').textContent;

    switch (optionView) {
        case "出張精算" :
            rowTableE.forEach((element) => {
                if (element.querySelector('.recordlist-single_select-gaia').querySelector('span').textContent !== '出張精算') {
                    element.style.display='none'
                }
            })
        break;
        case "立替精算" :
            rowTableE.forEach((element) => {
                if (element.querySelector('.recordlist-single_select-gaia').querySelector('span').textContent !== '立替精算') {
                    element.style.display='none'
                }
            })  
        break;
        case "交際費・会議費生産" :
            rowTableE.forEach((element) => {
                if (element.querySelector('.recordlist-single_select-gaia').querySelector('span').textContent !== '交際費・会議費生産') {
                    element.style.display='none'
                }
            })  
        break;
        case "市内交通費精算" :
            rowTableE.forEach((element) => {
                if (element.querySelector('.recordlist-single_select-gaia').querySelector('span').textContent !== '市内交通費精算') {
                    element.style.display='none'
                }
            })
        break;
    }

    calculated.forEach(element => {
        if (element.textContent === 'Calculated')
            element.innerHTML =''
    });
    
        //check field if name ='hide' is will hide element
    hide_name_field('subtable-label-inner-gaia','hide');
    hide_name_field('recordlist-header-label-gaia','radio');
    });
})();

