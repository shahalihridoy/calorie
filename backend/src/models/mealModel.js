const { Schema, model } = require("mongoose");

const mealSchema = Schema({
  name: {
    type: String,
    required: [true, "Meal must have a name"],
  },
  maxFoodItemCount: {
    type: Number,
    required: [true, "Meal must have maximum number food items"],
    min: 1,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Entry must have user"],
  },
  __v: { type: Number, select: false },
});

const Meal = model("Meal", mealSchema, "meals");

module.exports = Meal;
