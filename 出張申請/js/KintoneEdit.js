(function () {
  'use strict';

  const eventsSubmit = ['app.record.edit.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    field_shown('recordNumber', false);

    handleViewTable3(record);
  });
})();
