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
        required: true,
        unique: true
    },
    message:{
        type:Boolean,
        required:true
    },
    call:{
        type:Boolean,
        required:true
    }
});

// const Messages = mongoose.model("messages", {
//     message: {
//         type: String,
//         unique: true,
//         required:true
//     }
// });

module.exports =Packages;