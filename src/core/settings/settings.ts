import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/blogs",
  DB_NAME: process.env.DB_NAME || "ed-back-lessons-blogs",
};
