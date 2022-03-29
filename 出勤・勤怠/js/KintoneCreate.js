(function () {
  'use strict';

  const eventsSubmit = ['app.record.create.submit'];
  kintone.events.on(eventsSubmit, function (event) {
    const record = event.record;
    let isRecord = false;
    const workingDateValue = record.working_date.value;
    const Type = record.Type.value;
    const query = 'working_date="' + workingDateValue + '"';
    // const { date } = useGetDate(new Date(Date.now()).getTime());
    const body = {
      app: appId,
      query: 'Created_by in (LOGINUSER())',
      fields: [
        '$id',
        'user_login',
        'Created_by',
        'Created_datetime',
        'working_date',
      ],
    };
    /// get record
    const getListRecord = new Promise((resolve, reject) => {
      kintone.api(
        kintone.api.url('/k/v1/records', true),
        'GET',
        body,
        function (resp) {
          resolve(resp.records);
        },
        function (error) {
          reject();
          console.log(error);
        }
      );
    });
    if (workingDateValue && Type) {
      return new kintone.Promise(function (resolve, reject) {
        var params = { app: appId, query: query };
        kintone.api('/k/v1/records', 'GET', params, function (resp) {
          getListRecord.then((recordToday) => {
            console.log('today2', recordToday);
            recordToday?.forEach((e) => {
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
