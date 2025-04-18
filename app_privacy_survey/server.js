import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

// get the environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// information for connecting to the mongo db coming from the env variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

// creates a client instance 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// connects the client instance to the database
async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

app.get('/api/data', async (req, res) => {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.post('/api/data', async (req, res) => {
    try {
      console.log("Survey response received:", req.body);
  
      // access the specified database and collection
      const database = client.db(dbName);
      const collection = database.collection(collectionName);

      // insert the data from the request body
      const result = await collection.insertOne(req.body);
  
      console.log("Data inserted:", result);
      
      // Respond with the inserted data or success message
      res.status(201).json(result);
    } catch (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "Failed to insert data" });
    }
  });

// start hosting the server
async function startServer() {
  try {
    await connectToDatabase();
    
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();

// Proper shutdown handling
process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  await client.close();
  process.exit(0);
});