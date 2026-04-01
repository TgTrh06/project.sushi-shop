// reference custom Express types (no runtime import)
/// <reference path="./types/express.d.ts" />

import app from "./app";
import { connectDB } from "./config/database.config";
import { env } from "./config/env.config";

const PORT = env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});