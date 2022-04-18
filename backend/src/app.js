const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const foodEntryRoutes = require("./routes/foodEntryRoutes");
const mealRoutes = require("./routes/mealRoutes");

const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/meals", mealRoutes);
app.use("/api/v1/food-entries", foodEntryRoutes);

// orphan route
app.all("*", (req, res, next) => {
  next(
    new AppError(`No url is found like ${req.originalUrl} on this server`, 404)
  );
});

// global error handler
app.use(globalErrorHandler);

module.exports = app;
