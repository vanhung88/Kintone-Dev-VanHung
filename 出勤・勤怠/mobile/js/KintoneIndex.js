(function () {
  'use strict';

  const eventsSubmit = ['mobile.app.record.index.show'];
  kintone.events.on(eventsSubmit, function (e) {
    const record = e.record;
    const tableListE = document.querySelectorAll(
      '.gaia-mobile-v2-app-index-recordlist-table-bodyrow'
    );
    const userLogin = kintone.getLoginUser().name;
    document.querySelector(
      '.gaia-mobile-v2-app-index-recordlist-table-headercell-label'
    ).textContent = 'レコード番号';
    handleViewList(tableListE, userLogin);
    create_button();
  });
})();
