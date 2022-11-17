const FileModel = require("../models/file-model");
const { cloudinary } = require("../utils/cloudinary");
const SHA256 = require("crypto-js/sha256");
const CryptoJS = require("crypto-js");

exports.saveFile = async (req, res) => {
  const { encodedFile, objId } = req.body;
  const senderEmail = req.user.email;
  try {
    const integrityCheckResult = await integrityCheck(objId, encodedFile.data);
    if (integrityCheckResult) {
      const uploadRes = await cloudinary.uploader.upload(encodedFile, {
        upload_preset: "ssd_files_directory",
      });
      console.log(uploadRes);
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

exports.saveHash = async (req, res) => {
  const { hash } = req.body;
  const senderEmail = req.user.email;
  try {
    const resObj = await FileModel.create({
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

const encryptText = (data) => {
  const encryptedText = CryptoJS.AES.encrypt(
    data,
    process.env.ENCRYPTION_KEY
  ).toString();
  return encryptedText;
};

const integrityCheck = async (objId, dataString) => {
  const hashStringify = JSON.stringify(SHA256(dataString).words);
  try {
    const savedHashDoc = await FileModel.findById({ _id: objId });
    const savedHashStringify = JSON.stringify(savedHashDoc.hash.words);
    return hashStringify === savedHashStringify;
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Error in integrityCheck controller-" + error });
  }
};
