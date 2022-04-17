const express = require("express");
const authController = require("../controllers/authController");
const foodEntryController = require("../controllers/foodEntryController");
const { userTypes } = require("../utils/constants");

const router = express.Router();
router.use(authController.protectRoute);

router
  .route("/")
  .get(foodEntryController.getAllFoodEntries)
  .post(foodEntryController.addFoodEntry)
  .put(foodEntryController.updateFoodEntry)
  .delete(foodEntryController.deleteFoodEntries);

router
  .route("/threshold")
  .get(
    authController.restricTo(userTypes.USER),
    foodEntryController.getAllFoodEntriesThreshold
  );

router
  .route("/analytics")
  .get(
    authController.restricTo(userTypes.ADMIN),
    foodEntryController.getFoodEntryAnalytics
  );

module.exports = router;
