(function () {
  'use strict';

  const eventsSubmit = ['app.record.detail.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    field_shown('recordNumber', false);
    console.log('3', record);
    handleViewTable3(record);
  });
})();
