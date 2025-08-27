import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const ConnectDb = async () => {
  try {
    const connectionString =
      process.env.MONGODB_URI || "mongodb://localhost:27017/youtubeBackend";

    const connection = await mongoose
      .connect(connectionString)
      .then(() => {
        console.log(
          `✅ MongoDB connected successfully: ${connection.connection.host}`
        );
      })
      .catch(() => {
        console.log(`Catching an error in mongodb connection`);
      });

    return connection;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
