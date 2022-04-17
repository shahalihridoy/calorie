const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createUser = async (data) => {
  const newUser = await User.create(data);
  const token = createToken(newUser._id);
  delete newUser.password;
  return { user: newUser, token };
};

const getUserFromToken = async (req, res, next) => {
  const jwtToken = req.headers.authorization;
  if (!jwtToken) {
    return next(new AppError("No token was provided", 401));
  }
  const [, token] = jwtToken.split(" ");
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("Invalid token", 401));
  }
  return user;
};

exports.verifyToken = catchAsync(async (req, res, next) => {
  const user = await getUserFromToken(req, res, next);
  req.user = user;
  console.log("testin....");
  console.log(user);
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const token = createToken(newUser._id);
  delete newUser.password;

  res.status(200).json({
    token,
    status: "success",
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = createToken(user._id);
  user.password = undefined;

  res.status(200).json({
    status: "success",
    data: user,
    token,
  });
});

exports.inviteUser = catchAsync(async (req, res, next) => {
  const data = req.body;
  data.password = crypto.randomBytes(4).toString("hex");

  const { user, token } = await createUser(data);
  user.password = data.password;

  res.status(200).json({
    status: "success",
    data: user,
    token,
  });
});

exports.protectRoute = catchAsync(async (req, res, next) => {
  const user = await getUserFromToken(req, res, next);
  req.user = user;
  next();
});

// ROLE BASED AUTHENTICATION
exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You don't have permission to perform this action", 403) //forbidden
      );

    next();
  };
};
