const mongoose = require("mongoose");

var event_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: String,
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"

    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    amountOfComments: Number
});

module.exports = mongoose.model("Event", event_Schema);