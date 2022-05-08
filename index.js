const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ivgpu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const productCollection = client.db("phonezone").collection("phones");

        app.get('/phones', async (req,res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);
        })
    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req,res) =>{
    res.send("data for data")
});
app.listen(port, () =>{
    console.log('running...', port);
})