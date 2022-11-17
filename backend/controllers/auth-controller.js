require("dotenv").config();
const validator = require("validator");
const UserModel = require("../models/user-model");

exports.register = async (req, res) => {
  const { email, password, username, accountType } = req.body;

  const isExistingEmail = await findEmailDuplicates(email, res);
  if (isExistingEmail) {
    return res.status(401).json({
      msg: "Email already exist, please try again with a new email",
    });
  }

  if (!isExistingEmail) {
    try {
      if (!validator.isEmail(email)) {
        res.status(401).send({
          msg: "Invalid email address, please check again",
        });
      }
      await UserModel.create({
        email,
        password,
        username,
        accountType,
      });
      // await SendEmail(email, password, process.env.CLIENT_BASE_URL);
      return res.status(201).json({ msg: "Registration is done!" });
    } catch (error) {
      return res.status(500).json({
        msg: "Error in register controller-" + error,
      });
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(422).json({
        msg: "Can not find the user, please check the email again",
      });
    } else {
      const isMatch = await user.matchPasswords(password);
      if (!isMatch) {
        res.status(401).send({
          msg: "Invalid credentials, please try again",
        });
      } else {
        const token = user.getSignedToken();
        const userEmail = user.email;
        const userStatus = user.status;
        const userAccountType = user.accountType;
        return res
          .status(200)
          .json({ token, userEmail, userStatus, userAccountType });
      }
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Error in login controller-" + error,
    });
  }
};

exports.loginSuccess = async (req, res, next) => {
  if (req.user) {
    const user = await UserModel.findOne({ email: req.user.email }).select(
      "+password"
    );
    if (!user) {
      return res.status(422).json({
        msg: "Can not find the user, please check the email again",
      });
    }
    const token = user.getSignedToken();
    const userAccountType = user.accountType;
    res.status(200).json({
      msg: "Successfully Logged In",
      user: req.user,
      token,
      userAccountType,
    });
  } else {
    res.status(403).json({ message: "Not Authorized" });
  }
};

exports.loginFailure = async (req, res) => {
  res.redirect(process.env.CLIENT_BASE_URL);
};

exports.logout = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect(process.env.CLIENT_BASE_URL);
  });
};

exports.getUser = async (req, res) => {
  if (req.user) {
    const username = req.user.username;
    let googleDisplayName = "";
    let profilePicture = "";

    if (req?.user?.googleAuth) {
      googleDisplayName = req.user.googleAuth.name;
      profilePicture = req.user.googleAuth.profilePicture;
    }
    res.status(200).json({
      username,
      googleDisplayName,
      profilePicture,
    });
  } else {
    res.status(403).json({ message: "Not Authorized" });
  }
};

const findEmailDuplicates = async (email, res) => {
  let existingAccount = null;
  try {
    existingAccount = await UserModel.findOne({ email: email });
    if (existingAccount) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return res.status(422).json({
      msg: "Error occurred in findUserByEmail function-" + err,
    });
  }
};
