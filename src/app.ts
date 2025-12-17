import express from "express";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.middleware.js";
import { createGraphQLServer } from "./graphql/index.js";
import { env } from "./config/index.js";

const app = express();
const PORT = env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// GraphQL
await createGraphQLServer(app);

// REST fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
