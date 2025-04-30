import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  try {
    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    if (req.method === "POST") {
      const result = await collection.insertOne(req.body);
      return res.status(201).json({ insertedId: result.insertedId });
    } else if (req.method === "GET") {
      const data = await collection.find().toArray();
      return res.status(200).json(data);
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (err) {
    console.error("MongoDB error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}