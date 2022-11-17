require("dotenv").config();
const MessageModel = require("../models/message-model");
const SHA256 = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const fs = require("fs");

const privateKey = fs.readFileSync("./rsa_2048_private_key.pem", "utf8");

exports.saveMessage = async (req, res) => {
  const { content, objId } = req.body;
  const encryptedText = encryptText(content);
  try {
    const integrityCheckResult = await integrityCheck(objId, content);
    if (integrityCheckResult) {
      await MessageModel.findByIdAndUpdate(
        {
          _id: objId,
        },
        {
          $set: { content: encryptedText },
        }
      );
      return res.status(201).json({ msg: "Encrypted Message Saved" });
    } else {
      return res.status(400).json({ msg: "Validation failed" });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Error in createMessage controller-" + error,
    });
  }
};

exports.saveHash = async (req, res) => {
  const { hash } = req.body;
  const senderEmail = req.user.email;
  try {
    const resObj = await MessageModel.create({
      hash,
      senderEmail,
    });
    return res.status(201).json(resObj);
  } catch (error) {
    return res.status(500).json({
      msg: "Error in saveHash controller-" + error,
    });
  }
};

const encryptText = (content) => {
  const encryptedText = CryptoJS.AES.encrypt(
    content,
    process.env.ENCRYPTION_KEY
  ).toString();
  return encryptedText;
};

const integrityCheck = async (objId, content) => {
  const contentHashStringify = JSON.stringify(SHA256(content).words);
  try {
    const savedHashDoc = await MessageModel.findById({ _id: objId });
    const savedHashStringify = JSON.stringify(savedHashDoc.hash.words);
    return contentHashStringify === savedHashStringify;
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Error in integrityCheck controller-" + error });
  }
};

exports.decryptTestEndpoint = async (req, res) => {
  const { cipherText } = req.body;
  try {
    const decryptedText = CryptoJS.AES.decrypt(
      cipherText,
      process.env.ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    return res.status(201).json(decryptedText);
  } catch (error) {
    return res.status(500).json({
      msg: "Error in decryptTestEndpoint controller-" + error,
    });
  }
};

exports.verifyAndSave = async (req, res) => {
  const { dataObj } = req.body;
  console.log(dataObj);
  const decrypted = crypto.privateDecrypt(
    privateKey,
    Buffer.from(dataObj, "base64")
  );
  const decryptedText = decrypted.toString("utf8");
  console.log("DECRYPTED: " + decryptedText);
};
