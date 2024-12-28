import mongoose from "mongoose";
import pg from "pg";


export const connectDB = async () => {
  try {
    const { Client } = pg;
    const psql = new Client({
      user: "postgres",
      password: "postgres",
      database: "postgres",
      host: "localhost",
      port: 5432,
    });
    const conn = await mongoose.connect("mongodb://localhost:27017/sushini");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

