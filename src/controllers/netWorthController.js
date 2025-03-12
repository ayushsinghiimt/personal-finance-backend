const prisma = require("../config/db");

exports.calculateNetWorth = async (req, res) => {
  try {
    const userId = req.user.id;

    const assets = await prisma.assetLiability.findMany({
      where: { userId, type: "ASSET" },
    });

    const liabilities = await prisma.assetLiability.findMany({
      where: { userId, type: "LIABILITY" },
    });

    const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilities = liabilities.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const netWorth = totalAssets - totalLiabilities;

    res.json({ totalAssets, totalLiabilities, netWorth });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
