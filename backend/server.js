require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");

const { googleAuthentication } = require("./config/google.auth");

const authRoutes = require("./routes/auth-routes");
const messageRoutes = require("./routes/message-routes");
const fileRoutes = require("./routes/file-routes");

const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.PASSPORT_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: URI, dbName: "ssd_db" }),
    cookie: {
      secure: false,
      expires: new Date(Date.now() + 25 * 60000).toISOString(),
      maxAge: 25 * 60000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "200mb", extended: true })); // middleware for parsing json objects
app.use(express.urlencoded({ limit: "50mb", extended: true })); // middleware for parsing URL
app.use(express.text({ limit: "50mb" })); // middleware for parsing URL

mongoose
  .connect(URI, { dbName: "ssd_db" })
  .then(() => {
    console.log("MongoDB Connection Success");
    googleAuthentication(passport);
  })
  .catch((err) => {
    console.log("Connection Failed - " + err);
  });

// API endpoints
app.use("/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/file", fileRoutes);

app.listen(PORT, () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
