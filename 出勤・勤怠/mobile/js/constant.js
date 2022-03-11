const disable_field = (record, fields) => {
  for (let field of fields) {
    record[field].disabled = true;
  }
};
const body = {
  app: 198,
  query: 'Created_by in (LOGINUSER())',
  fields: [
    '$id',
    'user_login',
    'Created_by',
    'Created_datetime',
    'time_check_in',
    'time_check_out',
    'working_date',
  ],
};

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

const field_shown = (field, status) => {
  kintone.app.record.setFieldShown(field, status);
};

const create_button = (tableListE, userLogin, dateNow) => {
  const headerSpace = document.querySelector(
    '.gaia-mobile-v2-app-index-navigationbar-bodyselector-left'
  );
  if (document.getElementById('check-in-home') != null) {
    return;
  } else {
    const CheckInAtHome = document.createElement('button');
    const CheckInAtOffice = document.createElement('button');
    const CheckOutButton = document.createElement('button');

    CheckInAtHome.id = 'check-in-home';
    CheckInAtOffice.id = 'check-in-office';
    CheckOutButton.id = 'check-out';

    CheckInAtHome.innerHTML = '出勤';
    CheckInAtOffice.innerHTML = '出社';
    CheckOutButton.innerHTML = '退勤';

    CheckInAtHome.onclick = () => {
      const check = confirm('Do you want check in');
      const updateType = '出勤';
      if (check) {
        handleCheckIn2(updateType);
      }
    };
    CheckInAtOffice.onclick = () => {
      const check = confirm('Do you want check in');
      const updateType = '出社';
      if (check) {
        handleCheckIn2(updateType);
      }
    };
    CheckOutButton.onclick = () => {
      const check = confirm('Do you want check out');
      const updateType = '退勤';
      if (check) {
        handleCheckOut2(updateType);
      }
    };
    headerSpace.appendChild(CheckInAtHome);
    headerSpace.appendChild(CheckInAtOffice);
    headerSpace.appendChild(CheckOutButton);
  }
};

const useGetDate = (id) => {
  let unix_timestamp = Number(id);

  let date;
  if (id.toString().length === 10) {
    date = new Date(unix_timestamp * 1000);
  } else {
    date = new Date(unix_timestamp);
  }

  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

  let month =
    date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;

  let year = date.getFullYear();

  let hours = date.getHours();

  let minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  return {
    date: year + '-' + month + '-' + day,
    time: hours + ':' + minutes,
  };
};

const updateTime = (recordNumber, time, field, updateType) => {
  let update;
  if (field === 'time_check_in') {
    update = {
      app: 198,
      id: recordNumber,
      record: {
        time_check_in: {
          value: time,
        },
        Type: {
          value: updateType,
        },
      },
    };
  } else {
    update = {
      app: 198,
      id: recordNumber,
      record: {
        time_check_out: {
          value: time,
        },
        Type: {
          value: updateType,
        },
      },
    };
  }
  kintone.api(
    kintone.api.url('/k/v1/record', true),
    'PUT',
    update,
    function (resp) {
      location.reload();
    },
    function (error) {
      console.log(error);
    }
  );
};

handleCheckIn2 = (updateType) => {
  let isCheckIn = false;
  let updateTimeCheckIn = false;

  kintone.api(
    kintone.api.url('/k/v1/records', true),
    'GET',
    body,
    function (resp) {
      const { date, time } = useGetDate(new Date(Date.now()).getTime());
      for (const e of resp.records) {
        if (e?.working_date?.value === date) {
          if (e?.time_check_in?.value === null) {
            updateTimeCheckIn = true;
            updateTime(e.$id.value, time, 'time_check_in', updateType);
            break;
          } else isCheckIn = true;
          break;
        }
      }

      if (updateTimeCheckIn) return;
      // chưa check in
      if (isCheckIn) {
        alert('本日に出勤を実施しました。');
      } else {
        const create = {
          app: 198,
          records: [
            {
              working_date: {
                value: date, // year/,month/day
              },
              time_check_in: {
                value: time, // hour:minute
              },
              Type: {
                value: updateType, // dropdown value
              },
            },
          ],
        };

        kintone.api(
          kintone.api.url('/k/v1/records', true),
          'POST',
          create,
          function (resp) {
            location.reload();
          },
          function (error) {
            console.log(error);
          }
        );
      }
    },
    function (error) {
      console.log(error);
    }
  );
};

handleCheckOut2 = (updateType) => {
  let isCheckOut = false;
  let updateTimeCheckOut = false;

  kintone.api(
    kintone.api.url('/k/v1/records', true),
    'GET',
    body,
    function (resp) {
      const { date, time } = useGetDate(new Date(Date.now()).getTime());
      for (const value of resp.records) {
        if (value?.working_date?.value === date) {
          isCheckOut = true;
          if (value?.time_check_out?.value === null) {
            if (value?.time_check_in?.value !== null) {
              updateTimeCheckOut = true;
              updateTime(value?.$id?.value, time, 'time_check_out', updateType);
            } else {
              alert('You have to check in before check out');
              return;
            }
          }
          break;
        }
      }

      if (updateTimeCheckOut) return;
      // chưa check in
      if (isCheckOut) {
        alert(' 本日に勤怠を実施しました。');
      }
    },
    function (error) {
      console.log(error);
    }
  );
};

const handleViewList = (tableListE, userLogin) => {
  if (
    document.querySelector(
      '.gaia-mobile-v2-app-index-navigationbar-bodyselector-viewselectbutton'
    ).textContent !== '勤務日'
  ) {
    document.querySelector('tbody').style.display = 'none';
  }
  tableListE.forEach((e) => {
    if (
      e?.querySelectorAll('.gaia-mobile-v2-app-index-recordlist-table-cell')[5]
        ?.innerText !== userLogin
    ) {
      for (let i = 3; i < 5; i++) {
        e
          .querySelectorAll('.gaia-mobile-v2-app-index-recordlist-table-cell')
          [i].querySelector(
            '.gaia-mobile-v2-app-index-recordlist-table-textcellvalue'
          ).style.display = 'none';
      }
    }
  });
};
