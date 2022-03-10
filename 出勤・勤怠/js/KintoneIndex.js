(function () {
  'use strict';

  const eventsSubmit = ['app.record.index.edit.show', 'app.record.index.show'];
  kintone.events.on(eventsSubmit, function (e) {
    document
      .querySelector('thead')
      .querySelector('.recordlist-header-cell-inner-gaia').textContent =
      'レコード番号';
    create_button();
    // handleViewList(tableListE, userLogin, dateNow);
  });
})();
