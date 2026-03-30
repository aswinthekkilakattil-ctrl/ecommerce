import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ??
  'mongodb+srv://nexstonteam_db_user:secured@testsecured.kv89gnz.mongodb.net/?appName=testsecured';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function tryDbConnect() {
  try {
    await dbConnect();
    return true;
  } catch {
    return false;
  }
}

export default dbConnect;
