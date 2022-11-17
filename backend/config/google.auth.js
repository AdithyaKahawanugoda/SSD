require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20");
const UserModel = require("../models/user-model");

exports.googleAuthentication = (passport) => {
  GoogleStrategy.Strategy;
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
      },
      async (accessToken, refreshToken, profile, callback) => {
        const userGoogleObj = {
          googleId: profile.id,
          gmail: profile._json.email,
          name: profile.displayName,
          profilePicture: profile._json.picture,
        };
        await UserModel.findOneAndUpdate(
          { email: userGoogleObj.gmail },
          { $set: { googleAuth: userGoogleObj } }
        )
          .then((user) => {
            return callback(null, user);
          })
          .catch((error) => {
            return callback(error.message);
          });
      }
    )
  );

  passport.serializeUser(async (user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    UserModel.findById(id, (err, user) => {
      callback(err, user);
    });
  });
};
