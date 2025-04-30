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

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1 },
});

async function connectOnce() {
  // Always safe to call; it will reuse an existing connection
  await client.connect();
}

app.get('/', async (req, res) => {
  await connectOnce();
  const data = await client
    .db(process.env.DB_NAME)
    .collection(process.env.COLLECTION_NAME)
    .find()
    .toArray();
  res.json(data);
});

app.post('/', async (req, res) => {
  await connectOnce();
  const result = await client
    .db(process.env.DB_NAME)
    .collection(process.env.COLLECTION_NAME)
    .insertOne(req.body);
  res.status(201).json(result);
});

// Default export the serverless handler
export default serverless(app);