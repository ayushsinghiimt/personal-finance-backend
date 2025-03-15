const prisma = require("../config/db");

exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category: categoryId, amount, type, description, date } = req.body;
    console.log(req.body);
    console.log(userId);
    const transaction = await prisma.transaction.create({
      data: { userId, categoryId, amount, type, description, date },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId, "get transaction by user");
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        date: "desc", // Sort by date in descending order (latest first)
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.delete({
      where: { id: id },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, categoryId, amount, type, description, date } = req.body;
    const transaction = await prisma.transaction.update({
      where: { id: id },
      data: { userId, categoryId, amount, type, description, date },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactionsCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    const formattedCategories = categories.map((category) => ({
      value: category.id, // Use id as value
      label: category.name, // Use name as label
    }));
    res.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
};
