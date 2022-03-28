(function () {
  'use strict';

  let events = ['app.record.create.show'];
  kintone.events.on(events, function (event) {
    var record = event.record;
    hide_name_field('subtable-label-inner-gaia', 'hide');
    handleViewTable3(record);
    console.log('table3', record.table3);
  });
  kintone.events.on('app.record.create.submit', function (event) {
    var record = event.record;
    autoFillV2(record);
    return event;
  });
})();
