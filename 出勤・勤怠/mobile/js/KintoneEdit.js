(function () {
  'use strict';

  const eventsSubmit = [
    'mobile.app.record.edit.show',
    'mobile.app.record.edit.change.',
  ];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
  });
})();
