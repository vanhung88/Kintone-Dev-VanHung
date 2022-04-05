(function () {
  ('use strict');

  let events = ['app.record.create.show'];
  kintone.events.on(events, function (event) {
    var record = event.record;
    const CalculatedE = document.querySelectorAll('.input-number-cybozu');
    hide_name_field('subtable-label-inner-gaia', 'hide');
    handleViewTable3(record);
    // hide "Calculated"
    // for (const item of CalculatedE) {
    //   console.log(item);
    //   if (item.value === 'Calculated') {
    //     item.style.opacity = 0;
    //   }
    // }
  });

  kintone.events.on('app.record.create.submit', function (event) {
    var record = event.record;
    autoFillV2(record);
    return event;
  });
})();
