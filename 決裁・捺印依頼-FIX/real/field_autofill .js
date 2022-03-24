(function() {
  "use strict";
  kintone.events.on('app.record.create.show', function(event) {
    var record = event.record;

    // ユーザテストコード
    record.一次承認実行者.value = [{code: 'bap-kintone-developer@bap.jp', name: 'test1'}];
    record.決裁承認実行者.value = [{code: 'bap-kintone-developer@bap.jp', name: 'test2'}];
    record.押印確認実行者.value = [{code: 'bap-kintone-developer@bap.jp', name: 'test3'}];
    return event;
  });
})();