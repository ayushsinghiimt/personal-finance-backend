const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

// const authRoutes = require("./routes/authRoutes.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const financialSummaryRoutes = require("./routes/financialSummaryRoute.js");
const assetLiabilityRoute = require("./routes/assetLiabilityRoute.js");
const userRoute = require("./routes/userRoute.js");

dotenv.config();

const app = express();
app.use(helmet());

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api/v1/financial-summary", financialSummaryRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/assets-liabilities", assetLiabilityRoute);
app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
