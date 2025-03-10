const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authenticateUser = require("../middlewares/authMiddleware");

router.post("/", authenticateUser, transactionController.createTransaction);
router.get("/", authenticateUser, transactionController.getTransactionsByUser);

module.exports = router;
