const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvufd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
async function run() {
    try {
        await client.connect()
        const productsCollection = client.db('data').collection('product')
        //all products
        //https://agile-journey-07748.herokuapp.com/products
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray(cursor)
            res.send(result)
        })

        //four products
        app.get('/fourProducts', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.limit(4).toArray(cursor)
            res.send(result)
        })
    } finally {
        //
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
