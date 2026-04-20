import mongoose from "mongoose";
import { logger } from "../utils/common/logger.util";
import { env } from "./env.config";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};