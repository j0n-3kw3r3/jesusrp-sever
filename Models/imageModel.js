const mongoose = require("mongoose");

const Image = mongoose.Schema({
  url: String,
  description: String,
});

module.exports = mongoose.model("Image", Image);
