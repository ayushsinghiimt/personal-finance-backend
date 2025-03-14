const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authMiddleware");
const finanCialSummaryController = require("../controllers/financialSummaryController");

router.get(
  "/",
  authenticateUser,
  finanCialSummaryController.getFinancialSummary
);

module.exports = router;
