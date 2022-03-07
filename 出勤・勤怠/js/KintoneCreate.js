(function () {
   "use strict";

    const eventsSubmit = ['app.record.create.show'];
    kintone.events.on(eventsSubmit, function (e) {
        const record = e.record;
    });
})();

