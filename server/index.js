const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const client = require('./client')
const app = new Koa()
const router = new Router

app.use(cors());

router.get('/search', async (ctx, next) => {
    const {
        q
    } = ctx.request.query
    console.log(`Searching for ${q}`)
    ctx.body = await client.search({
        index: 'adviser',
        body: {
            query: {
                multi_match: {
                    query: q,
                    fields: ["name", "number", "abn"],
                    type: "phrase"
                }
            },
            collapse: {
                field: "number.keyword",
                inner_hits: {
                    name: "status_sorted",
                    size: 20,
                    sort: [
                        {
                            "status.keyword": "desc"
                        }
                    ]
                }
            }
        }
    })
})
router.get('/search-number', async (ctx, next) => {
    const {
        number
    } = ctx.request.query
    console.log(`Searching number for ${number}`)
    ctx.body = await client.search({
        index: 'adviser',
        size: 20,
        body: {
            query: {
                match: {
                    number
                }
            }
        }
    })
})


app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

const port = process.env.PORT || 3000

app.use(router.routes()).use(router.allowedMethods()).listen(port, err => {
    if (err) throw err
    console.log(`App listening on Port ${port}`)
})
