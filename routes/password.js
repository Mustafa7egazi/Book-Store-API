const express = require("express");
const {
  getForgotPasswordView,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetThePassword,
} = require("../controllers/passwordController");
const router = express.Router();

//password/forgot-password
router
  .route("/forgot-password")
  .get(getForgotPasswordView)
  .post(sendForgotPasswordLink);

//pasword/reset-password/:id/:token
router
  .route("/reset-password/:id/:token")
  .get(getResetPasswordView)
  .post(resetThePassword);

module.exports = router;
