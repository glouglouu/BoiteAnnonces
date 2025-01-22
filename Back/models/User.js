const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  surname: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
