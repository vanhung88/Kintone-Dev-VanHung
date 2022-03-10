
(function () {
   "use strict";
 
    const dropDown = "type_cost"; //field code of radio button field
    const taxiGroup4_2 = "taxi_gr4_2";
    const radioButton = "Radio_button";

    const eventsSubmit = ['app.record.edit.show',
                        'app.record.edit.change.' + dropDown,
                        'app.record.edit.change.' + taxiGroup4_2,
                        'app.record.edit.change.' + radioButton,
                        ];
    kintone.events.on(eventsSubmit, function(e) {
        const record = e.record;
        const dropDownValue = record[dropDown].value;
        
        //check field if name ='hide' is will hide element
        
        hide_field_group();
        // check radio
        check_radio_button(dropDownValue)
        
        // open/close Field Groups depending on radio button choice
        switch_group(dropDownValue,record);
        hide_name_field('subtable-label-inner-gaia','hide');
    });
})();

