import mongoose, { Document, Schema } from "mongoose";

export interface IPurchase extends Document {
  product_code: string;
  quantity: number;
  total_price: number;
  status: "completed" | "failed";
  transaction_date: Date;
}

const purchaseSchema = new Schema(
  {
    product_code: {
      type: String,
      required: true,
      ref: "SushiStock",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },
    transaction_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Purchase = mongoose.model<IPurchase>("Purchase", purchaseSchema);
