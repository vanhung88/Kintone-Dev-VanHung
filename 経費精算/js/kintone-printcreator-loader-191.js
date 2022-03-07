var _pcreatorConfig;

_pcreatorConfig = _pcreatorConfig || {};

_pcreatorConfig = {
appCode: "c62ce9ca96f0f04db752018bfdafa2b41c73bad3",
baseUrl: "//print.kintoneapp.com",
sheets: JSON.parse('\u005B\u007B\u0022id\u0022\u003A271260,\u0022title\u0022\u003A\u0022\\u5e02\\u5185\\u4ea4\\u901a\\u8cbb\\u7cbe\\u7b97\u0022,\u0022sheetType\u0022\u003A\u0022single\u0022,\u0022isDisplay\u0022\u003Atrue\u007D,\u007B\u0022id\u0022\u003A271214,\u0022title\u0022\u003A\u0022\\u4ea4\\u969b\\u8cbb\\u30fb\\u4f1a\\u8b70\\u8cbb\\u751f\\u7523\u0022,\u0022sheetType\u0022\u003A\u0022single\u0022,\u0022isDisplay\u0022\u003Atrue\u007D,\u007B\u0022id\u0022\u003A271187,\u0022title\u0022\u003A\u0022\\u7acb\\u66ff\\u7cbe\\u7b97\u0022,\u0022sheetType\u0022\u003A\u0022single\u0022,\u0022isDisplay\u0022\u003Atrue\u007D,\u007B\u0022id\u0022\u003A270854,\u0022title\u0022\u003A\u0022\\u51fa\\u5f35\\u7cbe\\u7b97\u0022,\u0022sheetType\u0022\u003A\u0022single\u0022,\u0022isDisplay\u0022\u003Atrue\u007D\u005D'),
useAutoSave: true,
useTableCondition: false,
tableCondition: JSON.parse('\u005B\u007B\u0022label\u0022\u003A\u0022\u0022,\u0022conditions\u0022\u003A\u005B\u007B\u0022start\u0022\u003A0,\u0022end\u0022\u003A1\u007D\u005D\u007D\u005D'),
useLayoutInitialSelect: true,
layoutInitialSelect: JSON.parse('\u005B\u007B\u0022code\u0022\u003A\u0022type_cost\u0022,\u0022expectedValue\u0022\u003A\u0022\\u51fa\\u5f35\\u7cbe\\u7b97\u0022,\u0022target\u0022\u003A\u007B\u0022key\u0022\u003A270854,\u0022type\u0022\u003A\u0022sheet\u0022\u007D\u007D,\u007B\u0022code\u0022\u003A\u0022type_cost\u0022,\u0022expectedValue\u0022\u003A\u0022\\u7acb\\u66ff\\u7cbe\\u7b97\u0022,\u0022target\u0022\u003A\u007B\u0022key\u0022\u003A271187,\u0022type\u0022\u003A\u0022sheet\u0022\u007D\u007D,\u007B\u0022code\u0022\u003A\u0022type_cost\u0022,\u0022expectedValue\u0022\u003A\u0022\\u4ea4\\u969b\\u8cbb\\u30fb\\u4f1a\\u8b70\\u8cbb\\u751f\\u7523\u0022,\u0022target\u0022\u003A\u007B\u0022key\u0022\u003A271214,\u0022type\u0022\u003A\u0022sheet\u0022\u007D\u007D,\u007B\u0022code\u0022\u003A\u0022type_cost\u0022,\u0022expectedValue\u0022\u003A\u0022\\u5e02\\u5185\\u4ea4\\u901a\\u8cbb\\u7cbe\\u7b97\u0022,\u0022target\u0022\u003A\u007B\u0022key\u0022\u003A271260,\u0022type\u0022\u003A\u0022sheet\u0022\u007D\u007D\u005D'),
downloadedAt: "2022-02-22 18:16:48+09:00"
};

(function() {
  "use strict"
  var detailEvent = function (event) {
      var l, s, scr, styl;
      _pcreatorConfig.event = event;
      styl = document.createElement("link");
      styl.rel = "stylesheet";
      styl.type = "text/css";
      styl.href = "//print.kintoneapp.com/build/kintone-lib.min.css";
      l = document.getElementsByTagName("link")[0];
      l.parentNode.insertBefore(styl, l);
      scr = document.createElement("script");
      scr.type = "text/javascript";
      scr.async = true;
      scr.src = "//print.kintoneapp.com/build/kintone-lib.min.js";
      s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(scr, s);

      return event;
  };
  var indexEvent = function (event) {
      var l, s, scr, styl;
      _pcreatorConfig.event = event;
      styl = document.createElement("link");
      styl.rel = "stylesheet";
      styl.type = "text/css";
      styl.href = "//print.kintoneapp.com/build/kintone-lib.min.css";
      l = document.getElementsByTagName("link")[0];
      l.parentNode.insertBefore(styl, l);
      scr = document.createElement("script");
      scr.type = "text/javascript";
      scr.async = true;
      scr.src = "//print.kintoneapp.com/build/kintone-lib.min.js";
      s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(scr, s);

      return event;
  };

  kintone.events.on('app.record.detail.show', detailEvent);
  kintone.events.on('mobile.app.record.detail.show', detailEvent);
})();
