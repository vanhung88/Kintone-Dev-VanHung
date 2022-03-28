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
    if (document.querySelector('.gaia-argoui-select').innerText !== '勤務日') {
      document
        .querySelector('thead')
        .querySelector('.recordlist-header-cell-inner-gaia').textContent =
        'レコード番号';
    }
    create_button();
  });
})();
