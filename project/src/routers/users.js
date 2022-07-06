const express = require("express");
const Users = require("../models/users");
const Packages = require("../models/admin");
const auth = require("../middlewere/auth");
const router = new express.Router();

router.post("/users/register", async (req, res) => {
    const user = new Users(req.body);
    try {
        await user.save();
        // const token=await user.generateAuthToken();
        // res.status(200).send({user,token});
        res.send(user);
    } catch (e) {
        res.status(404).send(e);

    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(404).send(e);
    }
});

router.patch("/users/forgot_password", async (req, res) => {
    try {
        const user = await Users.findOneAndUpdate({ email: req.body.email }, { password: req.body.password }, { new: true });
        if (!user)
            return res.status(400).send("user.is not available");
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/users/user_profile", auth, async (req, res) => {
    res.send(req.user);
});

router.get("/users/all_Packages", async (req, res) => {
    Packages.find({}).then((packages) => {
        res.status(200).send(packages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});




module.exports = router;