const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    file: {
      filePublicId: {
        type: String,
        required: [
          false,
          "Error with Cloudinary service! Can not find the file URL.",
        ],
      },
      fileSecURL: {
        type: String,
        required: [
          false,
          "Error with Cloudinary service! Can not find the file URL.",
        ],
      },
    },
    senderEmail: {
      type: String,
    },
    hash: {
      words: [],
      sigBytes: Number,
    },
  },
  { timestamps: true }
);

const File = mongoose.model("file", FileSchema);

module.exports = File;
