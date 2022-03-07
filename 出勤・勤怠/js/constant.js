const disable_field = (record, fields) => {
  for (let field of fields) {
    record[field].disabled = true;
  }
};

const field_shown = (field, status) => {
  kintone.app.record.setFieldShown(field, status);
};

const create_button = (tableListE, userLogin, dateNow) => {
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
        handleCheckIn(tableListE, userLogin, dateNow, updateType);
      }
    };
    CheckInAtOffice.onclick = () => {
      const check = confirm('Do you want check in');
      const updateType = '出社';
      if (check) {
        handleCheckIn(tableListE, userLogin, dateNow, updateType);
      }
    };
    CheckOutButton.onclick = () => {
      const check = confirm('Do you want check out');
      const updateType = '退勤';
      if (check) {
        handleCheckOut(tableListE, userLogin, dateNow, updateType);
      }
    };
    kintone.app.getHeaderMenuSpaceElement().appendChild(CheckInAtHome);
    kintone.app.getHeaderMenuSpaceElement().appendChild(CheckInAtOffice);
    kintone.app.getHeaderMenuSpaceElement().appendChild(CheckOutButton);
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

  let day = date.getDate();

  let month = date.getMonth() + 1;

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

// handle button check in
const handleCheckIn = (tableListE, userLogin, dateNow, updateType) => {
  const { date, time } = useGetDate(new Date(Date.now()).getTime());
  let allCheckIn = 0;
  let isRecordCheckIn = false;
  let recordNumber;

  tableListE.forEach((e) => {
    if (
      // kiểm tra hôm nay đã check in chưa
      e
        ?.querySelectorAll('.recordlist-date-gaia')[0]
        ?.textContent?.slice(0, 6) === dateNow &&
      // kiểm tra người check in có phải mình không
      e?.querySelector('.recordlist-username-gaia')?.textContent === userLogin
    ) {
      recordNumber =
        e.querySelector('.recordlist-record_id-gaia')?.textContent * 1; // get stt record
      console.log(recordNumber);
      isRecordCheckIn = true;
      if (e?.querySelectorAll('.recordlist-time-gaia')[0]?.textContent === '') {
        updateTime(recordNumber, time, 'time_check_in', updateType);
        allCheckIn++; // update status đã check in
      }
    }
  });

  // đã check in ngày hôm đó , update time check in
  if (allCheckIn > 0) {
    return;
  }

  // chưa check in
  if (isRecordCheckIn) {
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
};

// handle button check out
const handleCheckOut = (tableListE, userLogin, dateNow, updateType) => {
  const { time } = useGetDate(new Date(Date.now()).getTime());
  let isCheckOut = 0;
  let recordNumber;

  for (let e of tableListE) {
    if (
      // kiểm tra hôm nay đã check in chưa
      e
        ?.querySelectorAll('.recordlist-date-gaia')[0]
        ?.textContent?.slice(0, 6) === dateNow &&
      // kiểm tra người check in có phải mình không
      e?.querySelector('.recordlist-username-gaia')?.textContent ===
        userLogin &&
      //kiểm tra đã checkin chưa , checkin rồi thì mới cho checkout
      e.querySelectorAll('.recordlist-time-gaia')[0]?.textContent !== ''
    ) {
      recordNumber =
        e.querySelector('.recordlist-record_id-gaia')?.textContent * 1;
      if (e.querySelectorAll('.recordlist-time-gaia')[1]?.textContent === '') {
        updateTime(recordNumber, time, 'time_check_out', updateType);
        isCheckOut++;
      }
    }
  }
  if (isCheckOut === 0) {
    alert(' 本日に勤怠を実施しました。');
  }
  // } else {
  //     const update = {
  //         'app': 198,
  //         'id': recordNumber,
  //         'record': {
  //             'time_check_out': {
  //                 'value': time
  //             },
  //             'Type': {
  //                 'value': updateType
  //             }
  //         }
  //     };

  //     kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', update, function(resp) {
  //         location.reload();
  //     }, function(error) {
  //         console.log(error);
  //     })
  // }
};

const handleViewList = (tableListE, userLogin, dateNow) => {
  tableListE.forEach((e) => {
    if (
      e
        ?.querySelectorAll('.recordlist-date-gaia')[0]
        ?.textContent?.slice(0, 6) !== dateNow
    ) {
      e.style.display = 'none';
    }
    if (
      e?.querySelector('.recordlist-username-gaia')?.textContent !== userLogin
    ) {
      for (let i = 0; i < 2; i++) {
        e
          .querySelectorAll('.recordlist-time-gaia')
          [i].querySelector('span').style.display = 'none';
      }
    }
  });
};
