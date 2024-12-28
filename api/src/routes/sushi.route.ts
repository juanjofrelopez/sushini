import { Router } from "express";
import {
  processSushiOrder,
  addStock,
  getVariety,
  addProduct,
  getStock,
} from "../controllers/sushi.controller";

const router = Router();

router.get("/variety", getVariety);
router.get("/stock", getStock);
router.post("/stock", addProduct);
router.post("/order", processSushiOrder);
router.post("/stock/:product_code", addStock);

export default router;
