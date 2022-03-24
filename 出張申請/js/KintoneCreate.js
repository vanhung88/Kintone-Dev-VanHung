(function () {
  'use strict';

  let events = [
    'app.record.create.show',
    // 'app.record.create.change.' + 'UseSectionFrom',
    // 'app.record.create.change.' + 'UseSectionTo',
    // 'app.record.create.change.' + 'TransportationFacilities',
    // 'app.record.create.change.' + 'Supplement',
    'app.record.create.change.' + 'Text',
  ];
  kintone.events.on(events, function (event) {
    var record = event.record;
    // autoFill(record);
    hide_name_field('subtable-label-inner-gaia', 'hide');
    handleViewTable3(record);
    autoFillV2(record);
  });
  kintone.events.on('app.record.create.submit', function (event) {
    var record = event.record;

    return event;
  });
})();
