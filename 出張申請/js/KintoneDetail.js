(function () {
  'use strict';

  const eventsSubmit = ['app.record.detail.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    field_shown('recordNumber', false);
    handleViewTable3(record);
    hide_name_field('subtable-label-inner-gaia', 'hide');
    handleLinkApp(record);
    // console.log(record.table1[1]?.value?.UseSectionFrom);
  });
})();
