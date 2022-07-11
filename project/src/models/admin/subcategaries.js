const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const SubCategaries = mongoose.model("subcategaries", {
    title: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    messages: [
        {
            _id: Object
        }
    ]
});

module.exports = SubCategaries;
