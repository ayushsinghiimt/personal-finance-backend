const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, fi);

module.exports = router;
