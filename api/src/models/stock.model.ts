import mongoose, { Document, Schema } from "mongoose";

export interface ISushiStock extends Document {
  product_code: string;
  name: string;
  stock: number;
  price: number;
}

const sushiStockSchema = new Schema(
  {
    product_code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const SushiStock = mongoose.model<ISushiStock>(
  "SushiStock",
  sushiStockSchema
);
