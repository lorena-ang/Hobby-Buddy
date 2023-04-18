const mongoose = require("mongoose");

var application_Schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: Boolean,
        default: 0
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
});

module.exports = mongoose.model("Application", application_Schema);