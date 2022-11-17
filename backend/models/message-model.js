const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    senderEmail: {
      type: String,
    },
    content: {
      type: String,
    },
    hash: {
      words: [],
      sigBytes: Number,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("message", NoteSchema);

module.exports = Note;
