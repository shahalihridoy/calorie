const Meal = require("../models/mealModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllMeals = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const meals = await Meal.find({ user: _id });

  res.status(200).json({
    status: "success",
    results: meals.length,
    data: meals,
  });
});

exports.getMealsByUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meals = await Meal.find({ user: id });

  res.status(200).json({
    status: "success",
    results: meals.length,
    data: meals,
  });
});

exports.addMeal = catchAsync(async (req, res, next) => {
  const data = req.body;
  const user = req.user._id;

  const meal = await Meal.create({ ...data, user });

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { _id, ...data } = req.body;

  const meal = await Meal.findOneAndUpdate({ _id }, data, { new: true });

  res.status(200).json({
    status: "success",
    data: meal,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const idList = req.body;

  const meals = await Meal.deleteMany({ _id: { $in: idList } });

  res.status(200).json({
    status: "success",
    data: meals,
  });
});
