(function () {
  'use strict';

  const eventsSubmit = [
    'app.record.edit.show',
  ];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    hide_name_field('subtable-label-inner-gaia', 'hide');
    handleViewTable3(record);

    //出張申請
    if (record?.Status?.value !== '出張申請') {
      //Business trip information is disabled
      const table1Array = record.table1.value;
      disable_field(record, [
        'Destination',
        'Purpose',
        'DepartureDate',
        'ReturnDate',
        'Note',
        'DeparturePlace',
        'table1',
      ]);

      document.querySelector('.subtable-row-label-text-gaia').style.display =
        'none';
      document.querySelector('.edit-subtable-gaia').style.display = 'none';
    } else {
      document.querySelector('.subtable-row-label-text-gaia').style.display =
        'block';
      document.querySelector('.edit-subtable-gaia').style.display = 'block';
    }
    return e;
  });
})();
