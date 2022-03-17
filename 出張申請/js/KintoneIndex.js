(function () {
  'use strict';

  const eventsSubmit = ['app.record.index.edit.show'];
  kintone.events.on(eventsSubmit, function (e) {
    console.log('INDEX');
  });
})();
