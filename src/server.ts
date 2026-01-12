
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// JSON body parsing
app.use(express.json());
// urlencoded for form posts if needed
app.use(express.urlencoded({ extended: true }));

// security + logging
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

// serve uploaded images statically
const staticDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(staticDir));

// mount API
app.use("/api", routes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
