const FileModel = require("../models/file-model");
const { cloudinary } = require("../utils/cloudinary");
const SHA256 = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const fs = require("fs");

exports.saveFile = async (req, res) => {
  const { dataObj, encryptedAESKey } = req.body;
  const senderEmail = req.user.email;
  const privateKey = fs.readFileSync("./rsa_2048_private_key.pem", "utf8");
  const buffer = Buffer.from(encryptedAESKey, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: "",
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  const decryptedAESKey = decrypted.toString("utf8");

  // decrypt dataObj
  const decryptedObj = JSON.parse(
    CryptoJS.AES.decrypt(dataObj, decryptedAESKey).toString(CryptoJS.enc.Utf8)
  );

  // integrity check
  const fileEncodeDataURL = decryptedObj.encodedFile;
  const hashFromFE = JSON.stringify(decryptedObj.hash.words);
  const fileEncodeDataURLHash = JSON.stringify(SHA256(fileEncodeDataURL).words);

  try {
    if (hashFromFE === fileEncodeDataURLHash) {
      const uploadRes = await cloudinary.uploader.upload(fileEncodeDataURL, {
        upload_preset: "ssd_files_directory",
      });
      const encryptedPublicId = encryptText(uploadRes.public_id);
      const encryptedSecureURL = encryptText(uploadRes.secure_url);
      await FileModel.create({
        senderEmail,
        file: {
          filePublicId: encryptedPublicId,
          fileSecURL: encryptedSecureURL,
        },
      });
      return res.status(201).json({ msg: "Encrypted File URLS Saved" });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error in saveFile controller-" + error,
    });
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

const encryptText = (data) => {
  const encryptedText = CryptoJS.AES.encrypt(
    data,
    process.env.ENCRYPTION_KEY
  ).toString();
  return encryptedText;
};
