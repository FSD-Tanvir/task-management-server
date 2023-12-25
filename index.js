const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.b5pjk32.mongodb.net/?retryWrites=true&w=majority`;

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

    const taskCollection = client.db("taskDB").collection("tasks");

    // to create task
    app.post("/create-task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
    app.get("/tasks", async (req, res) => {
      const email = req.query.email; 
      const query = { userEmail: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    // to delete a task
    app.delete("/delete/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      });

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

app.get("/", (req, res) => {
  res.send("Task Tracker is Running");
});

app.listen(port, () => {
  console.log("Task Tracker is running on port", port);
});
