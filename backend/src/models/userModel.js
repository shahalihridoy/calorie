const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { userTypes } = require("../utils/constants");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "User must have an email"],
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "User must have password"],
    minlength: 3,
    select: false,
  },
  role: {
    type: String,
    enum: [userTypes.ADMIN, userTypes.USER],
    default: userTypes.USER,
  },
  __v: { type: Number, select: false },
});

// encrypt password
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// this method will be available in all User document
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPassword = function () {
  return crypto.randomBytes(8).toString("hex");
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User; // default export
// exports.User = User; // multiple export
