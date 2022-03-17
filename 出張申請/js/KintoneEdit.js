(function () {
  'use strict';

  const eventsSubmit = [
    'app.record.edit.show',
    'app.record.edit.change.' + 'UseSectionFrom',
    'app.record.edit.change.' + 'UseSectionTo',
    'app.record.edit.change.' + 'TransportationFacilities',
    'app.record.edit.change.' + 'Supplement',
  ];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    console.log('EDIT');
    autoFill(record);
    handleViewTable3(record);
  });
})();
