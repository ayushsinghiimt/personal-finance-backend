const express = require("express");
const router = express.Router();

const authenticateUser = require("../middlewares/authMiddleware");
const assetLiabilityController = require("../controllers/assetLiabilityController");

router.get(
  "/",
  authenticateUser,
  assetLiabilityController.getAssetsAndLiabilities
);

router.post(
  "/create",
  authenticateUser,
  assetLiabilityController.createAssetOrLiability
);

router.put(
  "/update/:id",
  authenticateUser,
  assetLiabilityController.updateAssetOrLiability
);

router.delete(
  "/delete/:id",
  authenticateUser,
  assetLiabilityController.deleteAssetOrLiability
);

router.get(
  "/categories",
  authenticateUser,
  assetLiabilityController.getAssetLiabilityCategories
);
module.exports = router;
