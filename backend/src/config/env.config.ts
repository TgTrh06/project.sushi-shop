import dotenv from "dotenv";
dotenv.config();

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (!jwtAccessSecret) {
  throw new Error("Missing required environment variable: JWT_ACCESS_SECRET");
}

if (!jwtRefreshSecret) {
  throw new Error("Missing required environment variable: JWT_REFRESH_SECRET");
}

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI as string,

  NODE_ENV: process.env.NODE_ENV as string,

  JWT_ACCESS_SECRET: jwtAccessSecret,
  JWT_REFRESH_SECRET: jwtRefreshSecret,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
};
