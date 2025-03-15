const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authenticateUser = require("../middlewares/authMiddleware");

router.post("/", authenticateUser, transactionController.createTransaction);
router.get("/", authenticateUser, transactionController.getTransactionsByUser);
router.delete(
  "/:id",
  authenticateUser,
  transactionController.deleteTransaction
);
router.put("/:id", authenticateUser, transactionController.updateTransaction);
router.get(
  "/categories",
  authenticateUser,
  transactionController.getTransactionsCategories
);

module.exports = router;
