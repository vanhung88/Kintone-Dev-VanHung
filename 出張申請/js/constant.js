function disable_field(record, fields) {
    for (let field of fields){
        record[field].disabled = true;
    }
};

function field_shown(field, status) {
    kintone.app.record.setFieldShown(field, status);
};

function hide_field_group() {
    field_shown("Record_number_hide", false);
    field_shown("circle_hide", false);
    field_shown("arrow_hide", false);
    field_shown("circle_hide1", false);
    field_shown("circle_hide2", false);

    field_shown("group1_1", false);
    field_shown("groupGlobal", false);
    field_shown("group1_2", false);
    field_shown("group1_3", false);
    field_shown("group1_4", false);
    field_shown("group1_5", false);
    field_shown("group1_6", false);
    field_shown("group1_7", false);

    field_shown("group2_1", false);
    field_shown("group2_2", false);
    field_shown("group2_3", false);
        
    field_shown("group3_1", false);
    field_shown("group3_2", false);
    field_shown("BillingAmount_group3_3", false);
        
    field_shown("group4_1", false);
    field_shown("group4_2", false);
    field_shown("TotalPriceGroup4_3", false);
    field_shown("TotalTravelExpenseGroup4_3", false);
    field_shown("Total_group4_3", false);

}

function check_radio_button(dropDownValue) {
    // check radio
    const inputElementAll=document.querySelectorAll('.input-radio-item-cybozu')
    if (dropDownValue === '出張精算' || dropDownValue === '交際費・会議費生産') {
        if (inputElementAll) {
            inputElementAll[1]
                    .querySelector('input')
                    .setAttribute('disabled', true)
            inputElementAll[1]
                    .querySelector('input')
                    .checked = false
        
        }
    } else {
        if (inputElementAll) {
            inputElementAll[1]
                    .querySelector('input')
                    .removeAttribute('disabled')
        }
    }
}

function switch_group(dropDownValue,record) {
    switch (dropDownValue) {
        case "出張精算":
            field_shown("groupGlobal", true);
            field_shown("group1_2", true);
            field_shown("group1_3", true);
            field_shown("group1_4", true);
            field_shown("group1_5", true);
            field_shown("group1_6", true);
            field_shown("group1_7", true);
            opacity_name_field('control-label-text-gaia', 'hide');
        break;
        case "立替精算":
            field_shown("groupGlobal", true);
            field_shown("group2_2", true);
            field_shown("group2_3", true);
        break;
        case "交際費・会議費生産":
            field_shown("groupGlobal", true);
            field_shown("group3_1", true);
            field_shown("group3_2", true);
            field_shown("BillingAmount_group3_3", true);
            opacity_name_field('','timeHide')
        break;
        case "市内交通費精算":     
            var table = record["group4_2"].value               
            field_shown("groupGlobal", true);
            field_shown("group4_2", true);
            field_shown("TotalPriceGroup4_3", true);
            field_shown("TotalTravelExpenseGroup4_3", true);
            field_shown("Total_group4_3", true);
        break;
    }
}

function hide_name_field(className,text) {
    const field_name = document.querySelectorAll(`.${className}`);
    field_name.forEach(element => {
        if (element.textContent ==text) {
            element.style.display='none'
        }
    });
}
function opacity_name_field(className,text) {
    const field_name = document.querySelectorAll(`.${className}`);
    field_name.forEach(element => {
        if (element.textContent ==text) {
            element.style.opacity = 0;
        }
    });
}

function handleSelectDropdown() {
            const selectId = setInterval(() => {
            const dropDownElement = document.querySelectorAll('.pcreator-sheets-select')[0];
            const formOutput = document.getElementsByTagName("form")[1];
            if (dropDownElement) {
               clearInterval(selectId)
                switch (dropDownValue) {
                    case "出張精算":
                        id = 270854;
                        dropDownElement.options[3].selected = true
                        break;
                    case "立替精算":
                        id=271187
                        dropDownElement.options[2].selected = true
                        break;
                    case "交際費・会議費生産":
                        id = 271214;
                        dropDownElement.options[1].selected = true
                        break;
                    case "市内交通費精算":
                        id = 271260;
                        dropDownElement.options[0].selected = true
                        break;
                }
            } 
            const formAction= `https://print.kintoneapp.com/sheet/${id}/output?appCode=c62ce9ca96f0f04db752018bfdafa2b41c73bad3&appId=191&downloadedAt=2022-02-21%2019:23:55%2B09:00`
            formOutput.action=formAction
        }, 500)
}
