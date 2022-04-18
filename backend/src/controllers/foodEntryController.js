const FoodEntry = require("../models/foodEntryModel");
const catchAsync = require("../utils/catchAsync");
const { userTypes } = require("../utils/constants");

exports.getAllFoodEntries = catchAsync(async (req, res, next) => {
  let foodEntries = [];
  const { role, _id } = req.user;

  if (role === userTypes.ADMIN) {
    foodEntries = await FoodEntry.find().populate("meal", "name");
  } else if (role === userTypes.USER) {
    foodEntries = await FoodEntry.find({ user: _id }).populate("meal", "name");
  }

  res.status(200).json({
    status: "success",
    results: foodEntries.length,
    data: foodEntries,
  });
});

exports.getAllFoodEntriesThreshold = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  let limit = req.query?.limit || 2100;
  limit = parseInt(limit, 10);

  const aggregateQuery = [
    {
      $match: { user: _id },
    },
    {
      $group: {
        _id: "$date",
        calorie: { $sum: "$calorie" },
      },
    },
    {
      $match: { calorie: { $gt: limit } },
    },
    {
      $project: {
        date: "$_id",
        calorie: 1,
        _id: 0,
      },
    },
    {
      $sort: { _id: -1 },
    },
  ];

  const foodEntries = await FoodEntry.aggregate(aggregateQuery);

  res.status(200).json({
    status: "success",
    results: foodEntries.length,
    data: foodEntries,
  });
});

exports.getFoodEntryAnalytics = catchAsync(async (req, res, next) => {
  const thisWeek = new Date();
  const lastWeek = new Date();
  thisWeek.setHours(0, 0, 0, 0);
  lastWeek.setHours(0, 0, 0, 0);
  thisWeek.setDate(thisWeek.getDate() - 6);
  lastWeek.setDate(thisWeek.getDate() - 6);

  const p1 = FoodEntry.count({
    date: {
      $gte: thisWeek,
    },
  });

  const p2 = FoodEntry.count({
    date: {
      $gte: lastWeek,
      $lte: thisWeek,
    },
  });

  const p3 = FoodEntry.aggregate([
    {
      $match: {
        date: {
          $gte: thisWeek,
        },
      },
    },
    {
      $group: {
        _id: "$user",
        calorie: { $sum: "$calorie" },
      },
    },
    {
      $group: {
        _id: null,
        calorie: { $avg: "$calorie" },
      },
    },
    {
      $project: {
        _id: 0,
        calorie: 1,
      },
    },
  ]);

  const [thisWeekEntryCount, lastWeekEntryCount, averageCaloriePerUser] =
    await Promise.all([p1, p2, p3]);

  res.status(200).json({
    status: "success",
    data: {
      thisWeek: thisWeekEntryCount,
      lastWeek: lastWeekEntryCount,
      averageCalorie: averageCaloriePerUser[0]?.calorie ?? 0,
    },
  });
});

exports.addFoodEntry = catchAsync(async (req, res, next) => {
  const data = req.body;

  const foodEntry = await FoodEntry.create(data);

  res.status(200).json({
    status: "success",
    data: foodEntry,
  });
});

exports.updateFoodEntry = catchAsync(async (req, res, next) => {
  const { _id, ...data } = req.body;

  const foodEntry = await FoodEntry.findOneAndUpdate({ _id }, data, {
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: foodEntry,
  });
});

exports.deleteFoodEntries = catchAsync(async (req, res, next) => {
  const idList = req.body;

  const foodEntries = await FoodEntry.deleteMany({ _id: { $in: idList } });

  res.status(200).json({
    status: "success",
    data: foodEntries,
  });
});
