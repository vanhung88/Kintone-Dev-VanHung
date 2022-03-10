(function () {
  'use strict';

  const eventsSubmit = ['mobile.app.record.create.submit'];
  kintone.events.on(eventsSubmit, function (event) {
    const record = event.record;
    let recordListToday;
    let isRecord = false;
    const workingDateValue = record.working_date.value;
    const Type = record.Type.value;
    const masterAppId = 198; // App ID of a different app
    const query = 'working_date="' + workingDateValue + '"';
    const { date } = useGetDate(new Date(Date.now()).getTime());
    const body = {
      app: 198,
      query: 'Created_by in (LOGINUSER())  order by $id asc limit 100 offset 0',
      fields: [
        '$id',
        'user_login',
        'Created_by',
        'Created_datetime',
        'working_date',
      ],
    };
    /// get record
    const myPromise = new Promise((resolve, reject) => {
      kintone.api(
        kintone.api.url('/k/v1/records', true),
        'GET',
        body,
        function (resp) {
          // success
          recordListToday = resp.records;
          resolve(recordListToday);
        },
        function (error) {
          reject();
          console.log(error);
        }
      );
    });

    if (workingDateValue && Type) {
      return new kintone.Promise(function (resolve, reject) {
        var params = { app: masterAppId, query: query };
        kintone.api('/k/v1/records', 'GET', params, function (resp) {
          myPromise.then(() => {
            recordListToday?.forEach((e) => {
              if (e.working_date.value === workingDateValue) {
                isRecord = true;
              }
            });
            // check today have checked in
            if (isRecord) {
              alert('The day already exists');
              reject(resp);
            } else resolve(resp);
          });
        });
      }).then(function (resp) {
        return event;
      });
    }
    return event;
  });
})();
