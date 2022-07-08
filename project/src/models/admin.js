const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    address: {
        type: String,
        required: true
    },
    mobile_number: {
        type: Number,
        required: true,
        length: 10
    }
});

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;

    const token = jwt.sign({ _id: admin._id.toString() }, "thisismynewadmin",{expiresIn:"1800 seconds"});

    return token;
}

// middelewere for login
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new Error("unable to find user");
    }
    const isMatch = password == admin.password;

    if (!isMatch) {
        throw new Error("unable to find user")
    }

    return admin;

}

const Admin = mongoose.model("admininfos", adminSchema);

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

module.exports = { Packages, Messages, SubCategaries, Admin };