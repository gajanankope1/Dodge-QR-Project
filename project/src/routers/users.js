const express = require("express");
const Users = require("../models/users");
const Purchase_History = require("../models/purchase_history");
const { Packages } = require("../models/admin");
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

router.get("/users/all_Packages", auth, (req, res) => {
    Packages.find({}).then((packages) => {
        res.status(200).send(packages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});

router.post("/users/purchase_package", auth, async (req, res) => {
    const user_id = req.user._id;
    const package_id = req.body.package_id;
    const obj = {
        user_id,
        package_id
    }

    try {
        const packages = await Purchase_History.find({ user_id });
        console.log(packages);
        
    } catch (e) {
        res.status(404).send(e)
    }
    //return stop
    const purchased_package = new Purchase_History(obj);
    try {
        await purchased_package.save();
        res.send(purchased_package);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.patch("/users/select_subcategary", auth, async (req, res) => {
    const select_device = {
        subcategary_id: req.body.subcategary_id,
        devicelink_date: new Date()
    }
    Purchase_History.findOneAndUpdate({ user_id: req.user._id, package_id: req.body.package_id }, select_device, { new: true }).then((purchase_history) => {
        res.status(200).send(purchase_history);
    }).catch((e) => {
        res.status(404).send(e);
    })
});


module.exports = router;