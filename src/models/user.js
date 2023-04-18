const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

var user_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    profile_name: String,
    location: String,
    contact: String, 
    about_me: String
});

user_Schema.plugin(passportLocalMongoose,
    {
        usernameField: 'email'
    });

module.exports = mongoose.model("User", user_Schema);