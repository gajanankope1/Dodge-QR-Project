const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


Purchase_History = mongoose.model("purchasehistories", {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Users"
    },
    package_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"Packages"
    },
    subcategary_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubCategaries"
    },
    purchase_date: {
        type: Date,
        required: true,
        default: new Date()
    },
    devicelink_date:{
        type:Date
    }
});

module.exports=Purchase_History;