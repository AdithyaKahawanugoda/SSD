const express = require("express");
const router = express.Router();
const {
  saveMessage,
  saveHash,
  decryptTestEndpoint,verifyAndSave
} = require("../controllers/message-controller");

const { protectedWorkerOrManager } = require("../middlewares/auth-middleware");

router.route("/saveMessage").post(protectedWorkerOrManager, saveMessage);
router.route("/saveHash").post(protectedWorkerOrManager, saveHash);
router.route("/decrypt").get(decryptTestEndpoint);
router.route("/verifyAndSave").post(verifyAndSave);

module.exports = router;
