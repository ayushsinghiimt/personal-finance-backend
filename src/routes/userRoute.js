const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

router.post("/", authenticateUser, userController.createUser);

// Update user (based on id)
router.put("/:id", authenticateUser, userController.updateUser);

// Get user by email
router.get("/:email", authenticateUser, userController.getUser);

module.exports = router;
