const appIdConnect = 198;

function field_shown(field, status) {
  kintone.app.record.setFieldShown(field, status);
}
const disable_field = (record, fields) => {
  for (let field of fields) {
    record[field].disabled = true;
  }
};

function hide_name_field(className, text) {
  const field_name = document.querySelectorAll(`.${className}`);
  field_name.forEach((element) => {
    if (element.textContent == text) {
      element.style.display = 'none';
    }
  });
}

const autoFillV2 = (record) => {
  const table1 = record.table1.value;
  const result = [];

  for (const e of table1) {
    const newForm = {
      id: null,
      value: {
        AmountOfMoney2: { type: 'NUMBER', value: undefined },
        Date_3: { type: 'DATE', value: undefined },
        Supplement2: {
          type: 'SINGLE_LINE_TEXT',
          value: e.value.Supplement.value,
        },
        Text_15: { type: 'SINGLE_LINE_TEXT', value: undefined },
        TransportationFacilities2: {
          type: 'DROP_DOWN',
          value: e.value.TransportationFacilities.value,
        },
        UseSectionFrom2: {
          type: 'SINGLE_LINE_TEXT',
          value: e.value.UseSectionFrom.value,
        },
        UseSectionTo2: {
          type: 'SINGLE_LINE_TEXT',
          value: e.value.UseSectionTo.value,
        },
      },
    };
    result.push(newForm);
  }
  record.table3.value = result;
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

const handleViewTable3 = (record) => {
  if (record?.Status?.value !== '経費精算作成') {
    field_shown('table3', false);
  }
};
const body = {
  app: appIdConnect,
  query: 'Created_by in (LOGINUSER())',
  fields: ['$id', 'working_date'],
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

const createRecord = (date) => {
  const create = {
    app: appIdConnect,
    records: [
      {
        working_date: {
          value: date, // year/,month/day
        },
        note: {
          value: '出張',
        },
      },
    ],
  };

  kintone.api(
    kintone.api.url('/k/v1/records', true),
    'POST',
    create,
    function (resp) {},
    function (error) {
      console.log(error);
    }
  );
};
const handleLinkApp = (record) => {
  let recordList = [];
  const DepartureDate = record?.DepartureDate?.value;
  const ReturnDate = record?.ReturnDate?.value;
  let distanceTime =
    new Date(ReturnDate).getTime() - new Date(DepartureDate).getTime();

  let distanceDays = distanceTime / (1000 * 3600 * 24) + 1;

  if (record?.Status?.value === '経費精算作成') {
    if (DepartureDate && ReturnDate) {
      for (let i = 1; i <= distanceDays; i++) {
        let { date } = useGetDate(
          new Date(DepartureDate)?.getTime() + 1000 * 60 * 60 * 24 * i
        );
        let isAlready = false;
        // check date have already
        getListRecord
          .then((recordList) => {
            for (const item of recordList) {
              if (date === item.working_date.value) {
                isAlready = true;
              }
            }
          })
          .then(() => {
            if (isAlready === false) {
              // create record
              createRecord(date, '');
              console.log('create');
            } else {
              // reset satus
              isAlready = true;
            }
          });
      }
    }
  }
};
