const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri =
    'mongodb+srv://warehouse-manager:kSKGs4onMoQQfLit@cluster0.jvufd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
})
async function run() {
    try {
        await client.connect()
        const bookCollection = client.db('test').collection('devices')
        app.get('/books', async (req, res) => {
            const query = {}
            const cursor = bookCollection.find(query)
            const result = await cursor.toArray(cursor)
            console.log('from mongodb ')
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
