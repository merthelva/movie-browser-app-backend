const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  watchlist: [
    {
      type: Object,
      required: true,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
