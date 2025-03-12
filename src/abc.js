const jwt = require("jsonwebtoken");

const secretKey = "123"; // Never use such a weak secret in production
const payload = {
  id: 1,
  email: "user@example.com",
};

const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

console.log("Generated Token:", token);
