const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    attachment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
