const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
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

        // load all phones data
        app.get('/phones', async (req,res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const phones = await cursor.toArray();
            res.send(phones);
        });

        app.get('/myitems', async (req,res) =>{
            const email = req.query.email;
            const query = {email: email};
            const cursor = productCollection.find(query);
            const phone = await cursor.toArray();
            res.send(phone);
        })

        //load one data
        app.get('/phones/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const phone = await productCollection.findOne(query);
            res.send(phone);
        })
        //update quantity
        app.put('/phones/:id', async (req,res) =>{
            const id = req.params.id;
            const updatedPhone = req.body;
            const query = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedPhone.quantity,
                },
            };
            const result = await productCollection.updateOne(
                query,
                updatedDoc,
                options
            );
            res.send(result);
        });

        // POST data to add service
        app.post('/phones', async (req, res) =>{
            const newPhone = req.body;
            const result = await productCollection.insertOne(newPhone);
            res.send(result);
        });

        // DELETE data 
        app.delete('/phones/:id', async (req,res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
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