const mongoose = require("mongoose");

var event_Schema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: String,
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: String,
    tag: String,
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
    amountOfComments: Number,
    amountOfApplications: Number,
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Event", event_Schema);