const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
require("dotenv").config();

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("token is", token);
    if (!token) {
      console.log("token");
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    console.log("decoded", decoded);
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    console.log("user", user);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = authenticateUser;
