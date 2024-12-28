import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error";
import { logger } from "./middlewares/logger";
import sushiRoutes from "./routes/sushi.route";
import chatRoutes from "./routes/chat.route";
import { connectDB } from "./db";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger({logBody:false}));

app.use("/api/sushi", sushiRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
