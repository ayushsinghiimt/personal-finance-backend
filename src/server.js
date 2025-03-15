const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// const authRoutes = require("./routes/authRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const financialSummaryRoutes = require("./routes/financialSummaryRoute.js");
const assetLiabilityRoute = require("./routes/assetLiabilityRoute.js");
const userRoute = require("./routes/userRoute.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// app.use("/", (req, res) => {
//   res.json({ message: "server is running" });
// });
app.use("/api/v1/financial-summary", financialSummaryRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/assets-liabilities", assetLiabilityRoute);
app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
