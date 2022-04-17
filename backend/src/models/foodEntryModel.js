const { Schema, model } = require("mongoose");

const foodEntrySchema = Schema({
  name: {
    type: String,
    required: [true, "Entry must have a food name"],
    maxlength: 250,
  },
  calorie: {
    type: Number,
    required: [true, "Entry must have calorie"],
    min: 1,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  meal: {
    type: Schema.Types.ObjectId,
    ref: "Meal",
    required: [true, "Entry must have meal"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Entry must have user"],
  },
  __v: { type: Number, select: false },
});

const FoodEntry = model("FoodEntry", foodEntrySchema, "food-entries");

module.exports = FoodEntry;
