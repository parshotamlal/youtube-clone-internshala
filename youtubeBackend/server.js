// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { ConnectDb } from "./dbConnection/Connect.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Basic route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to YouTube Backend API" });
// });
// //  Routes
// import authRouter from "./routes/authRoutes.js";
// app.use("/user", authRouter);
// import postRouter from "./routes/postRoutes.js";
// app.use("/user", postRouter);
// // Start server function
// const startServer = async () => {
//   try {
//     // Connect to database
//     await ConnectDb();

//     // Start listening
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error(" Failed to start server:", error);
//     process.exit(1);
//   }
// };

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err) => {
//   console.error(" Unhandled Promise Rejection:", err);
//   process.exit(1);
// });

// // Start the server
// startServer();





import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 4000; // Fixed port

//  MongoDB Atlas connection string (replace <username>, <password>, <dbName>)
const MONGO_URI =
"mongodb+srv://parshotamworks:oYPJjZjekPg88ARd@cluster.ogcgrgp.mongodb.net/youtubeClone?retryWrites=true&w=majority";

// Database connection
const ConnectDb = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`
    );

    return connection;
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to YouTube Backend API" });
});

// Routes
import authRouter from "./routes/authRoutes.js";
app.use("/user", authRouter);

import postRouter from "./routes/postRoutes.js";
app.use("/user", postRouter);

// Start server function
const startServer = async () => {
  try {
    await ConnectDb();

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Start the server
startServer();
