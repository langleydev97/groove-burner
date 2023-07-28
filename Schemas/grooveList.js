const mongoose = require("mongoose");

const grooveListSchema = new mongoose.Schema({
  song: String,
  price: Number,
  email: String,
});

module.exports = mongoose.model("grooveList", grooveListSchema);
