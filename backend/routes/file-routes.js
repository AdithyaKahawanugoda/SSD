const express = require("express");
const router = express.Router();
const {
  saveFile,
  decryptTestEndpoint,
} = require("../controllers/file-controller");

const { protectedManager } = require("../middlewares/auth-middleware");

router.route("/saveFile").post(protectedManager, saveFile);
router.route("/decrypt").get(decryptTestEndpoint);

module.exports = router;

module.exports = router;
