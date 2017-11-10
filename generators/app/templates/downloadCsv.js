import _ from 'lodash';

export default function (filename, rows, headers) {
  function processRow(rowp, i) {
    const row = _.map(rowp, value => [value]);
    let finalVal = '';
    row.forEach((item, j) => {
      if (i === 0 && j === 0) {
        let ii = 0;
        _.forOwn(rows[i], (value, index) => {
          const fieldName = index === null ? '' : index.toString();
          let fieldResult = headers ? headers[fieldName] : fieldName;

          fieldResult = fieldResult.replace(/"/g, '""');
          if (fieldResult.search(/("|,|\n)/g) >= 0) {
            fieldResult = `"${fieldResult}"`;
          }
          if (ii > 0) {
            finalVal += ',';
            finalVal += fieldResult;
          } else {
            finalVal += fieldResult;
          }
          ii += 1;
        });
        finalVal += '\n';
      }
      let innerValue = item === null ? '' : item.toString();
      if (item instanceof Date) {
        innerValue = item.toLocaleString();
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
  }
  let csvFile = '';
  rows.forEach((field, i) => {
    csvFile += processRow(field, i);
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
