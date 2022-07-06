const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


Purchase_History = mongoose.model("purchasehistories", {
    user_id: {
        type: String,
        required: true
    },
    package_id: {
        type: String,
        required: true
    },
    subcategary_id:{
        type:String,
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