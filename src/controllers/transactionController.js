const prisma = require("../config/db");

exports.createTransaction = async (req, res) => {
  try {
    const { userId, categoryId, amount, type, description } = req.body;
    const transaction = await prisma.transaction.create({
      data: { userId, categoryId, amount, type, description },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
