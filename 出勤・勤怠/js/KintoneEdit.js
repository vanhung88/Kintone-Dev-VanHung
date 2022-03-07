(function () {
   "use strict";

    const eventsSubmit = [
        'app.record.edit.show',
        'app.record.edit.change.',
    ];
    kintone.events.on(eventsSubmit, function(e) {
        const record = e.record;
    });
})();

