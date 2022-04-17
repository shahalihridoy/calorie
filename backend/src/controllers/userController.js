const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.searchUser = catchAsync(async (req, res, next) => {
  const searchTerm = req.query?.search || "";

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
      $limit: 10,
    },
  ]);

  res.status(200).json({
    length: users.length,
    status: "success",
    data: users,
  });
});
