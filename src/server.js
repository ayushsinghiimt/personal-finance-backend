const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// const authRoutes = require("./routes/authRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/", (req, res) => {
  res.json({ message: "server is running" });
});
app.use("/api/financial-summary", transactionRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
