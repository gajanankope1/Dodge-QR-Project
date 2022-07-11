const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    whatsapp_primary_number: {
        type: Number,
        required: true,
        length: 10
    },
    whatsapp_secondary_number: {
        type: Number,
        length: 10
    },
    emergency_number: {
        type: Number,
        required: true,
        length: 10
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
    resetToken: String,
    expireToken: Date,
    address: {
        type: String,
        required: true
    }
    // tokens:[{
    //     token:{
    //         type:String,
    //         required:true
    //     }
    // }]
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, "thisismynewuser");

    // user.tokens=user.tokens.concat({token});
    // await user.save();

    return token;
}

// middelewere for login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await Users.findOne({ email });

    if (!user) {
        throw new Error("unable to find user");
    }

    // const isMatch = await bcrypt.compare(password, user.password)
    const isMatch = password == user.password;

    if (!isMatch) {
        throw new Error("unable to find user")
    }

    return user;

}

//middelewere for password security
// userSchema.pre("save", async function (next) {
//     const user = this;

//     if (user.isModified("password")) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next();
// })

// userSchema.pre("findByIdAndUpdate", async function (next) {
//     const user = this;
//     console.log(user);

//     if (user.isModified("password")) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next();
// })


const Users = mongoose.model("users", userSchema);


module.exports = Users;