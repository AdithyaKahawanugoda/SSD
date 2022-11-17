require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  loginFailure,
  loginSuccess,
  getUser,
} = require("../controllers/auth-controller");
const passport = require("passport");
const {
  protectedAdmin,
  protectedUser,
} = require("../middlewares/auth-middleware");

router.route("/register").post(protectedAdmin, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/login/success").get(loginSuccess);
router.route("/login/failed").get(loginFailure);
router.route("/profile").get(protectedUser, getUser);

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_BASE_URL}/login/failed`,
    successRedirect: `${process.env.CLIENT_BASE_URL}/login/success`,
    session: true,
  }),
  (req, res) => {
    console.log("user authenticated");
  }
);

module.exports = router;
