const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Messages = mongoose.model("messages", {
    message: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = Messages;
