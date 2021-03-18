const csv = require('csv-parser')
const fs = require('fs')
const results = [];
const client = require('./client')

const index = 'adviser'

async function resetIndex() {
    let exists = await client.indices.exists({ index })
    if (exists.statusCode === 200) {
        await client.indices.delete({ index })
    }
    await client.indices.create({ index })
}
resetIndex()
console.log("Adviser index generated")

fs.createReadStream('FINANCIAL_ADVISERS_202102.csv')
  .pipe(csv({ separator: '\t' }))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log("Read data successfully!");
    console.log(`${results.length} records found.`)
    indexData(results)
  });

async function indexData(results) {
    let bulkOps = []
    for (let i = 0; i < results.length; i++) {
        let result = results[i]
        bulkOps.push({
            index: {
                _index: index,
            }
        })
        bulkOps.push({
            name: result.ADV_NAME,
            number: result.ADV_NUMBER,
            abn: result.ADV_ABN,
            status: result.ADV_ROLE_STATUS,
            first_provided_advice: result.ADV_FIRST_PROVIDED_ADVICE,
            licence_name: result.LICENCE_NAME,
            licence_number: result.LICENCE_NUMBER,
            licence_abn: result.LICENCE_ABN,
            licence_controlled_by: result.LICENCE_CONTROLLED_BY,
            start_date: result.ADV_START_DT,
            end_date: result.ADV_END_DT,
            memberships: result.MEMBERSHIPS
        })

        if (i > 0 && i % 500 === 0) {
            await client.bulk({
                body: bulkOps
            })
            bulkOps = []
            console.log(`Indexed advisers ${i - 499} - ${i}`)
        }
    }
    await client.bulk({
        body: bulkOps
    })
    console.log(`Indexed advisers ${results.length - (bulkOps.length / 2)} - ${results.length}`)
}