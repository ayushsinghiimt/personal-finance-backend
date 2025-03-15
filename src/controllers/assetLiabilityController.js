const prisma = require("../config/db");

exports.getAssetsAndLiabilities = async (req, res) => {
  try {
    const userId = req.user.id;
    const assetsAndLiabilities = await prisma.assetLiability.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });

    res.json(assetsAndLiabilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAssetOrLiability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, value, categoryId } = req.body;

    const newAssetOrLiability = await prisma.assetLiability.create({
      data: {
        userId,
        name,
        type,
        value,
        categoryId,
      },
    });

    res.status(201).json(newAssetOrLiability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAssetOrLiability = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, value, categoryId } = req.body;

    const updatedAssetOrLiability = await prisma.assetLiability.update({
      where: { id },
      data: {
        name,
        type,
        value,
        categoryId,
      },
    });

    res.json(updatedAssetOrLiability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAssetOrLiability = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.assetLiability.delete({
      where: { id },
    });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetLiabilityCategories = async (req, res) => {
  try {
    const categories = await prisma.assetLiabilityCategory.findMany();

    const formattedCategories = categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));

    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
