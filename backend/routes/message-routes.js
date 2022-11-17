const express = require("express");
const router = express.Router();
const {
  decryptTestEndpoint,
  verifyAndSave,
} = require("../controllers/message-controller");

const { protectedWorkerOrManager } = require("../middlewares/auth-middleware");

router.route("/decrypt").get(decryptTestEndpoint);
router.route("/verifyAndSave").post(protectedWorkerOrManager, verifyAndSave);

module.exports = router;
