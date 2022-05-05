const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

//middleware
app.use(cors())
app.use(express.json())

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
        //and query api
        //https://agile-journey-07748.herokuapp.com/products
        app.get('/products', async (req, res) => {
            const query = req.query
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray(cursor)
            res.send(result)
        })

        //single product
        //https://agile-journey-07748.herokuapp.com/product/${product_id}
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await productsCollection.findOne(filter)
            res.send(result)
        })

        //update product
        //https://agile-journey-07748.herokuapp.com/product/626e73247574c9e478f804fd
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    quantity: data.quantity,
                },
            }
            const result = await productsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        //four products
        //https://agile-journey-07748.herokuapp.com/fourProducts
        app.get('/fourProducts', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.limit(6).toArray(cursor)
            res.send(result)
        })

        //post
        //https://agile-journey-07748.herokuapp.com/product
        app.post('/product', async (req, res) => {
            const data = req.body
            const result = await productsCollection.insertOne(data)
            res.send(result)
        })

        //delete product
        //https://agile-journey-07748.herokuapp.com/product/626e44f37574c9e478db68db
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(filter)
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
