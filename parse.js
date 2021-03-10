const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('FINANCIAL_ADVISERS_202102.csv')
  .pipe(csv({ separator: '\t' }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results[0]);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });