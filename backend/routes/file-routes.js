const express = require("express");
const router = express.Router();
const { saveFile, saveHash } = require("../controllers/file-controller");

const { protectedManager } = require("../middlewares/auth-middleware");

router.route("/saveFile").post(saveFile);
router.route("/saveHash").post(protectedManager, saveHash);

module.exports = router;

module.exports = router;
