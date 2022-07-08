const mongoose = require("mongoose");
const validator = require("validator");


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

const Messages = mongoose.model("messages", {
    message: {
        type: String,
        unique: true,
        required: true
    }
});

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

module.exports = { Packages, Messages, SubCategaries };