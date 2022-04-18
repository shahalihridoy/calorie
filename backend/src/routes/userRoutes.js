const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { userTypes } = require("../utils/constants");

const router = express.Router();
router.use(authController.protectRoute);

router
  .route("/search")
  .get(authController.restricTo(userTypes.ADMIN), userController.searchUser);
router
  .route("/")
  .get(authController.restricTo(userTypes.ADMIN), userController.getAllUsers);

module.exports = router;
