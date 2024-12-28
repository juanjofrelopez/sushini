// src/routes/chat.routes.ts
import { Router } from "express";
import { handleChatStream } from "../controllers/chat.controller";

const router = Router();

router.post("/stream", handleChatStream);

export default router;