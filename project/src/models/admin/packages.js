const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Packages = mongoose.model("packages", {
    package: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    message: {
        type: Boolean,
        required: true
    },
    call: {
        type: Boolean,
        required: true
    }
});

module.exports =Packages