const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authMiddleware");
const finanCialSummaryController = require("../controllers/financialSummaryController");

router.get(
  "/",
  authenticateUser,
  finanCialSummaryController.getFinancialSummary
);
router.get(
  "/income-expense",
  authenticateUser,
  finanCialSummaryController.getFinancialSummaryIncomeExpense
);
router.get(
  "/expenses-category",
  authenticateUser,
  finanCialSummaryController.getExpensesByCategory
);

module.exports = router;
