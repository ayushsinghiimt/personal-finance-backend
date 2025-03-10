const jwt = require("jsonwebtoken");
require("dotenv").config();

const SUPABASE_JWT_SECRET = "123";

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateUser;
