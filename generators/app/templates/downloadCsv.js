import _ from 'lodash';

export default function (filename, rows, headers) {
    var processRow = function (row) {
        row = _.map(row, function(value, index) {
            return [value];
        });
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            if(i == 0 && j == 0){
                var ii = 0;
                _.forOwn(rows[i], function( value, index ) {
                    //console.log(index);
                    var fieldName = index === null ? '' : index.toString();
                    //console.log(fieldName);
                    var fieldResult = headers ? headers[fieldName] : fieldName;
                    
                    fieldResult = fieldResult.replace(/"/g, '""');
                    //console.log(fieldResult);
                    if (fieldResult.search(/("|,|\n)/g) >= 0){
                        fieldResult = '"' + fieldResult + '"';
                    }
                    //console.log(fieldResult);
                    if (ii > 0){
                        finalVal += ',';
                        finalVal += fieldResult;
                    }else{
                        finalVal += fieldResult;
                    }
                    ii++;
                    //console.log(finalVal);
                });
                finalVal += '\n';
                //console.log('end: '+finalVal);
            }
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0){
                result = '"' + result + '"';
            }
            if (j > 0){
                finalVal += ',';
                finalVal += result;
            }else{
                finalVal += result;
            }
        }
        return finalVal + '\n';
    };
    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    }else{
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};
