require("dotenv").config();
const MessageModel = require("../models/message-model");
const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");
const fs = require("fs");

exports.decryptTestEndpoint = async (req, res) => {
  const { cipherText } = req.body;
  const privateKey = fs.readFileSync("./rsa_2048_private_key.pem", "utf8");

  try {
    const buffer = Buffer.from(cipherText, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey.toString(),
        passphrase: "",
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    const decryptedObj = JSON.parse(decrypted.toString("utf8"));
    return res.status(201).json(decryptedObj);
  } catch (error) {
    return res.status(500).json({
      msg: "Error in decryptTestEndpoint controller-" + error,
    });
  }
};

exports.verifyAndSave = async (req, res) => {
  const { dataObj } = req.body;
  const senderEmail = req.user.email;
  const privateKey = fs.readFileSync("./rsa_2048_private_key.pem", "utf8");
  const buffer = Buffer.from(dataObj, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: "",
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  const decryptedObj = JSON.parse(decrypted.toString("utf8"));

  // integrity check
  const plainText = decryptedObj.msg;
  const hashFromFE = JSON.stringify(decryptedObj.hash.words);
  const plainTextHash = JSON.stringify(SHA256(plainText).words);

  try {
    if (hashFromFE === plainTextHash) {
      const resObj = await MessageModel.create({
        content: dataObj,
        senderEmail,
      });
      return res.status(201).json(resObj);
    } else {
      return res
        .status(400)
        .json({ msg: "Error in integrityCheck controller-" + error });
    }
  } catch (error) {}
};
