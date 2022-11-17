const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email",
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    accountType: {
      type: String,
      enum: ["WORKER", "ADMIN", "MANAGER"],
      default: "WORKER",
    },
    googleAuth: {
      googleId: String,
      gmail: String,
      name: String,
      profilePicture: String,
    },
  },
  { timestamps: true }
);

// by using mongoose pre hook with save we run this code segment before mongoose save data on db
UserSchema.pre("save", async function (next) {
  // check whether the password has already been hashed or not by using isModified
  if (!this.isModified("password")) {
    next();
  }

  // hash password before saving into db
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// to compare hashed passwords in login scenarios
UserSchema.methods.matchPasswords = async function (password) {
  // password refers to user providing one and this.password refers to one that get from db
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  // create jwt with Object Id and Account Type as the payload
  return jwt.sign(
    { objId: this._id, role: this.accountType },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
