(function () {
  'use strict';

  const eventsSubmit = ['mobile.mobile.app.record.detail.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    //code
  });
})();
