const express = require("express");
const authController = require("../controllers/authController");
const mealController = require("../controllers/mealController");

const router = express.Router();
router.use(authController.protectRoute);

router
  .route("/")
  .get(mealController.getAllMeals)
  .post(mealController.addMeal)
  .put(mealController.updateMeal)
  .delete(mealController.deleteMeal);

router.route("/user/:id").get(mealController.getMealsByUser);

module.exports = router;
