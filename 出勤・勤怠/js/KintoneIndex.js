(function () {
  'use strict';

  const eventsSubmit = ['app.record.index.edit.show', 'app.record.index.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    const tableListE = document.querySelectorAll('.recordlist-row-gaia');
    const dateNow = new Date().toString().slice(4, 10);
    const userLogin = kintone.getLoginUser().name;
    document
      .querySelector('thead')
      .querySelector('.recordlist-header-cell-inner-gaia').textContent =
      'レコード番号';
    create_button(tableListE, userLogin, dateNow);
    handleViewList(tableListE, userLogin, dateNow);
  });
})();
