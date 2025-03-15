const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create user (only email)
const createUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.create({
      data: { email },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Update user (based on id)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, firstName, lastName, mobileNo, currency, gender } =
    req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        password,
        firstName,
        lastName,
        mobileNo,
        currency,
        gender,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Get user by email
const getUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createUser,
  updateUser,
  getUser,
};
