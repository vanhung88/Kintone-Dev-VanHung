(function () {
  'use strict';

  const eventsSubmit = ['mobile.app.record.create.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
  });
})();
