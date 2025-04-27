const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const PORT = process.env.PORT || 8080; 
const app = express();
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Basic route for testing server
app.get("/", (req, res) => {
  res.send("API is running...");
});


app.listen(
  PORT,
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections (optional but good practice)
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
});
