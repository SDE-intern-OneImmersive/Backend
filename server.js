const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRouter');
const AppRoutes = require('./routes/appRouter');
const versionRoutes = require('./routes/versionRouter');

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/user',userRoutes);
app.use('/app', AppRoutes);
app.use('/version', versionRoutes);

app.get('/',(req,res) => {
    res.send('Server is ready')
})

// MongoDB

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vamsiboyina:Vamsiboyina242@bbc-db.ft9yef6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);


app.listen(port,() => {console.log(`Server started on Port ${port}`)})