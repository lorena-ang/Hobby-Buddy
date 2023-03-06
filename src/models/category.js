const mongoose = require("mongoose");

var category_Schema = mongoose.Schema({
    name: String,
});

module.exports = mongoose.model("Category", category_Schema);