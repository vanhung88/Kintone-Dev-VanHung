(function () {
  'use strict';

  const eventsSubmit = ['app.record.index.edit.show', 'app.record.index.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    const tableListE = document.querySelectorAll('.recordlist-row-gaia');
    const userLogin = kintone.getLoginUser().name;
    console.log('CHECK');

    // none all record

    // change text record number
    document
      .querySelector('thead')
      .querySelector('.recordlist-header-cell-inner-gaia').textContent =
      '勤務タイプ';
    create_button();
  });
})();
