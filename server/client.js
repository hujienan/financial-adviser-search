const { Client } = require('@elastic/elasticsearch')
const host = process.env.ES_HOST || 'localhost'
const client = new Client({
    node: `http://${host}:9200`
})

module.exports = client