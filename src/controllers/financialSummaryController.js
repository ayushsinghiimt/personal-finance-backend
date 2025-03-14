const prisma = require("../config/db");

exports.financialSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - 60);
    const previousEndDate = new Date();
    previousEndDate.setDate(previousEndDate.getDate() - 30);

    // ✅ Single query for income and expense (current + previous period)
    const transactions = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    });

    const last30Days = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: startDate },
      },
      _sum: {
        amount: true,
      },
    });

    const previous30Days = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        userId,
        date: { gte: previousStartDate, lt: previousEndDate },
      },
      _sum: {
        amount: true,
      },
    });

    // ✅ Single query for assets and liabilities
    const financials = await prisma.assetLiability.groupBy({
      by: ["type"],
      where: {
        userId,
      },
      _sum: {
        value: true,
      },
    });

    // Map data from the results
    const totalIncome =
      transactions.find((t) => t.type === "INCOME")?._sum.amount || 0;
    const totalExpense =
      transactions.find((t) => t.type === "EXPENSE")?._sum.amount || 0;

    const last30DaysIncome =
      last30Days.find((t) => t.type === "INCOME")?._sum.amount || 0;
    const last30DaysExpense =
      last30Days.find((t) => t.type === "EXPENSE")?._sum.amount || 0;

    const previous30DaysIncome =
      previous30Days.find((t) => t.type === "INCOME")?._sum.amount || 0;
    const previous30DaysExpense =
      previous30Days.find((t) => t.type === "EXPENSE")?._sum.amount || 0;

    const totalAssets =
      financials.find((f) => f.type === "ASSET")?._sum.value || 0;
    const totalLiabilities =
      financials.find((f) => f.type === "LIABILITY")?._sum.value || 0;

    // ✅ Calculate performance changes
    const incomeChange = previous30DaysIncome
      ? ((last30DaysIncome - previous30DaysIncome) / previous30DaysIncome) * 100
      : last30DaysIncome
      ? 100
      : 0;

    const expenseChange = previous30DaysExpense
      ? ((last30DaysExpense - previous30DaysExpense) / previous30DaysExpense) *
        100
      : last30DaysExpense
      ? 100
      : 0;

    // ✅ Net worth calculation
    const netWorth = totalAssets - totalLiabilities;

    // ✅ Response
    res.json({
      totalIncome,
      totalExpense,
      netWorth,
      totalAssets,
      totalLiabilities,
      performance: {
        incomeChange: `${incomeChange.toFixed(2)}%`,
        expenseChange: `${expenseChange.toFixed(2)}%`,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
