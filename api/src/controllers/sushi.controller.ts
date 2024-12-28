import e, { Request, Response } from "express";
import { SushiOrder } from "../types";
import { SushiStock } from "../models/stock.model";
import { Purchase } from "../models/purchase.model";

export const processSushiOrder = async (req: Request, res: Response) => {
  try {
    const { product_code, quantity }: SushiOrder = req.body;
    if (!product_code || !quantity) throw new Error("Missing arguments");

    const sushi = await SushiStock.findOne({ product_code });

    if (!sushi)
      return res.status(404).json({ error: "Sushi variety not found" });
    if (sushi.stock < quantity)
      return res.status(400).json({ error: "Insufficient stock" });

    try {
      await SushiStock.findByIdAndUpdate(sushi._id, {
        $inc: { stock: -quantity },
      });

      const purchase = new Purchase({
        product_code: sushi.product_code,
        quantity,
        total_price: quantity * sushi.price,
        status: "completed",
      });
      await purchase.save();

      res.status(200).json({
        success: "Order processed successfully",
      });
    } catch (error) {
      throw error;
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to process order" });
  }
};

export const addStock = async (req: Request, res: Response) => {
  try {
    const { product_code } = req.params;
    const { quantity } = req.body;
    if (!quantity || !product_code) throw new Error("Missing arguments");

    const sushi = await SushiStock.findOne({ product_code });
    if (!sushi) throw new Error("Product not found");
    await sushi.updateOne({ $inc: { stock: +quantity } });

    res.status(200).json({
      message: "Stock added successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to process order" });
  }
};

export const getVariety = async (req: Request, res: Response) => {
  try {
    const stock = await SushiStock.find({});
    if (!stock.length) throw new Error("No products found");
    const mapped = stock.map((s) => ({
      name: s.name,
      product_code: s.product_code,
    }));
    res.status(200).json({
      stock: mapped,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to process order" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, product_code, price, stock } = req.body;
    if (!name || !product_code || !price || !stock)
      throw new Error("Missing arguments");
    await SushiStock.create({ name, product_code, price, stock });
    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to process order" });
  }
};

export const getStock = async (req: Request, res: Response) => {
  try {
    const stock = await SushiStock.find({});
    res.status(200).json({
      stock,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message ?? "Failed to process order" });
  }
};
