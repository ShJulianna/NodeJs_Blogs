import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL:
    process.env.MONGO_URL ||
    "mongodb+srv://shj_db:aspo@cluster0.dkqogy6.mongodb.net/?appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "ed-back-lessons-blogs",
};
