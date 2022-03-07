
(function () {
   "use strict";
 
    const dropDown = "type_cost"; //field code of radio button field

    const eventsSubmit = ['app.record.detail.show'];
   kintone.events.on(eventsSubmit, function(e) {
        const record = e.record;
        const dropDownValue = record[dropDown].value;
        let id;
        
        hide_field_group();
         // open/close Field Groups depending on radio button choice
        switch_group(dropDownValue, record);
       
        handleSelectDropdown()
        
        //check field if name ='hide' is will hide element
        hide_name_field('subtable-label-inner-gaia','hide');
    });
})();

