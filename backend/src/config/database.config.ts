import mongoose from "mongoose";
import { logger } from "../utils/common/logger.util";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};