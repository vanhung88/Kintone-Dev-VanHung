(function () {
  'use strict';

  let events = [
    'app.record.create.show',
    'app.record.create.change.' + 'UseSectionFrom',
    'app.record.create.change.' + 'UseSectionTo',
    'app.record.create.change.' + 'TransportationFacilities',
    'app.record.create.change.' + 'Supplement',
  ];
  kintone.events.on(events, function (event) {
    var record = event.record;

    autoFill(record);
    //hide field
    handleViewTable3(record);
    hide_name_field('subtable-label-inner-gaia', 'hide');
  });
  kintone.events.on('app.record.create.submit', function (event) {
    let record = event.record;
    return event;
  });
})();
