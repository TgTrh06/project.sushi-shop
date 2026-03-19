// reference custom Express types (no runtime import)
/// <reference path="./core/types/express.d.ts" />

import app from "./app";
import { connectDB } from "./core/config/database.config";
import { env } from "./core/config/env.config";

const PORT = env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});