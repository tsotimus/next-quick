/* eslint-disable no-var */
import mongoose from "mongoose";

declare global {
  var mongooseCache: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

// Ensure caching across hot reloads in development
global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

async function dbConnect(): Promise<mongoose.Connection> {
  if (global.mongooseCache.conn) return global.mongooseCache.conn;

  if (!global.mongooseCache.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }

    global.mongooseCache.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    }).then(mongoose => mongoose.connection);
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (error) {
    global.mongooseCache.promise = null; // Reset cache on error
    throw error;
  }

  return global.mongooseCache.conn;
}

export default dbConnect;