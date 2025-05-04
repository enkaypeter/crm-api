// src/app.js
import express from "express";
import fs from "fs/promises";
import swaggerUi from "swagger-ui-express";
import loadUser from "./middleware/loadUser.js";
import seedPermitData from "../scripts/syncPermitData.js";
import { accountsRouter, transactionsRouter, adminRouter } from "./routes/index.js";

const app = express();
app.use(express.json());

// Swagger docs
const openApiSpec = JSON.parse(await fs.readFile("./openapi.json", "utf-8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(loadUser);

// Routes
app.use("/accounts", accountsRouter);
app.use("/transactions", transactionsRouter);
app.use("/admin", adminRouter);

export default app;

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await seedPermitData(); 
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    } catch (err) {
      console.error("❌ Failed to seed Permit data:", err);
      process.exit(1);
    }
  })();
}
