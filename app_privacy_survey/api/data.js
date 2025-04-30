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

// Mongo setup
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const colName = process.env.COLLECTION_NAME;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectOnce() {
  if (!client.isConnected?.()) {
    await client.connect();
    console.log("Connected to MongoDB");
  }
}

app.get('/', async (req, res) => {
  await connectOnce();
  const data = await client.db(dbName).collection(colName).find().toArray();
  res.json(data);
});

app.post('/', async (req, res) => {
  await connectOnce();
  const result = await client.db(dbName).collection(colName).insertOne(req.body);
  res.status(201).json(result);
});

export const handler = serverless(app);