(function () {
   "use strict";
 
    const dropDown = "type_cost"; //field code of radio button field
    const taxiGroup4_2 = "taxi_gr4_2";
    const radioButton = "Radio_button";
    const DepartureDate = "DepartureDate";
    const ReturnDate = "ReturnDate";

    const eventsSubmit = ['app.record.create.show',
                        'app.record.create.change.' + dropDown,
                        'app.record.create.change.' + taxiGroup4_2,
                        'app.record.create.change.' + radioButton,
                        'app.record.create.change.' + ReturnDate,
                        'app.record.create.change.' + DepartureDate,
                        ];
    kintone.events.on(eventsSubmit, function(e) {
        const record = e.record;
        const dropDownValue = record[dropDown].value;
        const DepartureDateValue=record['DepartureDate'].value;
        const ReturnDateValue = record['ReturnDate'].value;
        console.log(DepartureDateValue)
        hide_field_group();
        // check radio
        check_radio_button(dropDownValue);
        
        // open/close Field Groups depending on radio button choice
        switch_group(dropDownValue, record);
        
        hide_name_field('subtable-label-inner-gaia','hide');
        hide_name_field('label-text-cybozu','hide');
    });
})();

