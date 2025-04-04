const prisma = require("../config/db");
const moment = require("moment");

exports.getFinancialSummary = async (req, res) => {
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
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFinancialSummaryIncomeExpense = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated

    const sixMonthsAgo = moment()
      .subtract(6, "months")
      .startOf("month")
      .toDate();
    const now = moment().endOf("month").toDate();

    // Fetch transactions for the last 6 months
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: sixMonthsAgo,
          lte: now,
        },
      },
    });

    // Group by day
    const dailyData = {};

    transactions.forEach((transaction) => {
      const day = moment(transaction.date).format("YYYY-MM-DD");
      if (!dailyData[day]) {
        dailyData[day] = { income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        dailyData[day].income += Number(transaction.amount);
      } else if (transaction.type === "EXPENSE") {
        dailyData[day].expense += Number(transaction.amount);
      }
    });

    // Convert to array of values
    const xAxisData = [];
    const incomeData = [];
    const expenseData = [];

    Object.keys(dailyData)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((day) => {
        xAxisData.push(moment(day).format("MMM DD"));
        incomeData.push(dailyData[day].income);
        expenseData.push(dailyData[day].expense);
      });

    // Return in ECharts format
    const chartOptions = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Income", "Expenses"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: true,
          lineStyle: {
            color: "#f6f7f7d",
          },
        },
      },
      dataZoom: [
        {
          type: "inside", // Zoom using mouse wheel or touch
          xAxisIndex: 0, // Enable zoom on x-axis
          yAxisIndex: 0, // Enable zoom on y-axis
        },
        {
          type: "slider",
          show: false, // Zoom using a slider
        },
      ],
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {}, // Save chart as an image
          restore: {}, // Restore chart to original state
          dataView: {}, // Display data table
          magicType: {
            // Switch between line, bar, stack, and tiled views
            type: ["line", "bar"],
          },
          dataZoom: {
            // Zoom in and out
            yAxisIndex: "none",
          },
        },
      },
      series: [
        {
          name: "Income",
          type: "line",

          data: incomeData,
          itemStyle: {
            color: "green",
          },
        },
        {
          name: "Expenses",
          type: "line",

          data: expenseData,
          itemStyle: {
            color: "red",
          },
        },
      ],
    };

    res.json(chartOptions);
  } catch (error) {
    console.error("Error fetching financial graph data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

exports.getExpensesByCategory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all expense transactions grouped by category
    const expenses = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId: userId,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    });

    // Fetch category details
    const categories = await prisma.category.findMany({
      where: {
        id: { in: expenses.map((exp) => exp.categoryId) },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Map category names to expenses
    const data = expenses.map((expense) => ({
      value: Number(expense._sum.amount || 0),
      name:
        categories.find((cat) => cat.id === expense.categoryId)?.name ||
        "Unknown",
    }));

    // Format data for ECharts pie chart
    const chartOptions = {
      title: {
        text: "Category-wise Expenses",
        subtext: "Last 6 months",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },

      series: [
        {
          name: "Expenses",
          type: "pie",
          radius: "50%",
          data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };

    res.status(200).json(chartOptions);
  } catch (error) {
    console.error("Error fetching category expenses:", error);
    res.status(500).json({ error: "Failed to fetch category expenses" });
  }
};
