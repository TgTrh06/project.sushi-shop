import mongoose from "mongoose";
import { env } from "@/core/config/env.config";
import { logger } from "@/core/logging/logger";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGO_URI).then((connection) => {
      logger.info("Connected to MongoDB");
      return connection;
    }).catch((error) => {
      connectionPromise = null;
      logger.error("MongoDB connection failed", { error });
      throw error;
    });
  }
  return connectionPromise;
}
