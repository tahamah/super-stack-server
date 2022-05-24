const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

//middleware
app.use(cors())
app.use(express.json())

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded
        next()
    })
}

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
            const query = {}
            const cursor = productsCollection.find(query)
            const result = await cursor.toArray(cursor)
            res.send(result)
        })
        //myProducts
        //https://agile-journey-07748.herokuapp.com/myProducts?email=taha.iu.bd@gmail.com
        app.get('/myProducts', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.query.email
            if (decodedEmail === email) {
                const query = { email }
                const cursor = productsCollection.find(query)
                const result = await cursor.toArray(cursor)
                res.send(result)
            } else {
                return res.status(403).send({ message: 'Forbidden access' })
            }
        })
        //Auth
        //https://agile-journey-07748.herokuapp.com/login
        app.post('/login', async (req, res) => {
            const user = req.body
            const accessToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1d',
                }
            )
            res.send({ accessToken })
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
            console.log(data)
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
    res.send('Super Stack Server is running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
