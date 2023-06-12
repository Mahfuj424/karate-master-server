const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgokub5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addClassCollection = client.db("martialArts").collection("addClass");
    const addUserCollection = client.db("martialArts").collection("user")



    app.put('/user/:email', async (req, res) => {
      const email = req.params.email
      const user = req.body
      const query = { email: email }
      const options = { upsert: true }
      const updatedDoc = {
        $set: user
      }
      const result = await addUserCollection.updateOne(query, updatedDoc, options)
      res.send(result)
    })


    app.get('/user', async (req, res) => {
      const result = await addUserCollection.find().toArray()
      res.send(result)
    })


    app.post("/addClass", async (req, res) => {
      const body = req.body;
      const result = await addClassCollection.insertOne(body);
      res.send(result);
    });


    app.get('/addClass', async (req, res) => {
      const result = await addClassCollection.find().toArray()
      res.send(result)
    })


    app.put('/addClass/:id', async (req, res) => {
      const id = req.params.id;
      const myClass = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedClasses = {
        $set: {
          image: myClass.image,
          className: myClass.className,
          price: myClass.price,
          availableSeats: myClass.availableSeats
        }
      }
      
      const result = await addClassCollection.updateOne(filter, updatedClasses, options)
      res.send(result)

    })


    app.put('/addClasses/:id', async (req, res) => {
      const id = req.params.id;
      const myClass = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedClasses = {
        $set: {
          status: myClass.status
        }
      }
      
      const result = await addClassCollection.updateOne(filter, updatedClasses, options)
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("let's start karate fight");
});

app.listen(port, () => {
  console.log(`start fight with karate on Port : ${port}`);
});
