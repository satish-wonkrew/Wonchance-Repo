import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error('Please define the MONGODB_URI and MONGODB_DB environment variables');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  const { status } = req.query;
  const { db } = await connectToDatabase();

  let query = {};
  if (status) {
    query.statusLevel = status;
  }

  const totalCount = await db.collection('users').countDocuments();
  const filteredCount = await db.collection('users').countDocuments(query);

  res.status(200).json({ totalCount, filteredCount });
}
