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
    ).textContent = '勤務タイプ';

    create_button();

    // hide view al record
    const recordOption = document.querySelectorAll('.menuitem-button');
    recordOption.forEach((item) => {
      if (item.textContent === '(All records)') {
        document.querySelectorAll('.menuitem-button')[2].style.display = 'none';
      }
    });
  });
})();
