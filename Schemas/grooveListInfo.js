const mongoose = require("mongoose");

const grooveListInfoSchema = new mongoose.Schema({
  title: String,
  img: String,
  userEmail: String,
});
module.exports = mongoose.model("grooveListInfo", grooveListInfoSchema);
