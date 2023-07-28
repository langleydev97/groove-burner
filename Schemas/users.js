const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: String,
  email: {
    type: String,
    minlength: 6,
    required: true,
    lowercase: true,
  },
  password: String,
});

module.exports = mongoose.model("user", userSchema);
