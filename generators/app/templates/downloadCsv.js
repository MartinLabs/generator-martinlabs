import _ from 'lodash';

export default function (filename, rows, headers) {
  const processRow = (rowp) => {
    const row = _.map(rowp, value => [value]);
    let finalVal = '';
    row.forEach((item, j) => {
      if (j === 0) {
        let ii = 0;
        _.forOwn(rows[0], (value, index) => {
          // console.log(index);
          const fieldName = index === null ? '' : index.toString();
          // console.log(fieldName);
          let fieldResult = headers ? headers[fieldName] : fieldName;

          fieldResult = fieldResult.replace(/"/g, '""');
          // console.log(fieldResult);
          if (fieldResult.search(/("|,|\n)/g) >= 0) {
            fieldResult = `"${fieldResult}"`;
          }
          // console.log(fieldResult);
          if (ii > 0) {
            finalVal += ',';
            finalVal += fieldResult;
          } else {
            finalVal += fieldResult;
          }
          ii += 1;
          // console.log(finalVal);
        });
        finalVal += '\n';
        // console.log('end: '+finalVal);
      }
      let innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) {
        result = `"${result}"`;
      }
      if (j > 0) {
        finalVal += ',';
        finalVal += result;
      } else {
        finalVal += result;
      }
    });
    return `${finalVal}\n`;
  };
  let csvFile = '';
  rows.forEach((item, i) => {
    csvFile += processRow(rows[i]);
  });
  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
