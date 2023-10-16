require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ihebt0u.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const userCollection = client.db("personDB").collection("person");
const userCollection2 = client.db("userDB").collection("user");
// .....................
app.get("/persons", async (req, res) => {
  const cursor = userCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});
app.get("/persons/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.findOne(query);
  res.send(result);
});
app.post("/persons", async (req, res) => {
  // data on server
  const person = req.body;
  console.log(person);
  //   data to database
  const result = await userCollection.insertOne(person);
  res.send(result);
});
app.put("/persons/:id", async (req, res) => {
  const id = req.params.id;
  const users = req.body;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatePersons = {
    $set: {
      name: users.name,
      email: users.email,
    },
  };
  const result = await userCollection.updateOne(filter, updatePersons, options);
  res.send(result);
});
app.delete("/persons/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});

// api connect for users
app.get("/users", async (req, res) => {
  const cursor = userCollection2.find();
  const result = await cursor.toArray();
  res.send(result);
});
app.post("/users", async (req, res) => {
  const user = req.body;
  console.log(user);
  const result = await userCollection2.insertOne(user);
  res.send(result);
});
app.get("/", (req, res) => {
  res.send("My update server is running");
});

app.listen(port, (req, res) => {
  console.log(`The process: ${port}`);
});
