// api/data.js
import express from 'express';
import serverless from 'serverless-http';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create and start the Mongo client at import time
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1 },
});

// Kick off the connection *immediately* and reuse it
const clientPromise = client.connect().then(() => {
  console.log("✅ MongoDB connected");
  return client;
}).catch(err => {
  console.error("❌ MongoDB connection failed", err);
  throw err;
});

app.get('/', async (req, res) => {
  // Wait for the initial connection promise
  const dbClient = await clientPromise;
  const data = await dbClient
    .db(process.env.DB_NAME)
    .collection(process.env.COLLECTION_NAME)
    .find()
    .toArray();
  res.json(data);
});

app.post('/', async (req, res) => {
  const dbClient = await clientPromise;
  const result = await dbClient
    .db(process.env.DB_NAME)
    .collection(process.env.COLLECTION_NAME)
    .insertOne(req.body);
  res.status(201).json(result);
});

export default serverless(app);