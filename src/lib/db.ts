import mongoose from "mongoose";

const databaseUri = process.env.DATABASE_URI;

type CachedConnection = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseConnection: CachedConnection | undefined;
}

const cache = globalThis.mongooseConnection ?? {
  connection: null,
  promise: null,
};

globalThis.mongooseConnection = cache;

export function isDatabaseConfigured() {
  return Boolean(databaseUri);
}

export async function connectToDatabase() {
  if (!databaseUri) {
    throw new Error("DATABASE_URI is not configured.");
  }

  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(databaseUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8_000,
    });
  }

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
