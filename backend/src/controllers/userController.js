const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { userTypes } = require("../utils/constants");

exports.searchUser = catchAsync(async (req, res, next) => {
  const searchTerm = req.query?.name || "";

  const users = await User.aggregate([
    {
      $match: {
        name: {
          $regex: searchTerm,
          $options: "i",
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  res.status(200).json({
    length: users.length,
    status: "success",
    data: users,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: userTypes.USER });

  res.status(200).json({
    length: users.length,
    status: "success",
    data: users,
  });
});
