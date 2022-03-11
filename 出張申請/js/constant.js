function field_shown(field, status) {
  kintone.app.record.setFieldShown(field, status);
}

const handleViewTable3 = (record) => {
  if (record?.Status?.value !== '経費精算作成') {
    // field_shown('TransportationExpenses', false);
  } else {
    // console.log('EEE');
    // // handle Implement Fill
  }
};
