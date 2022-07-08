const express = require("express");
const models = require("../models/admin");
const Users = require("../models/users");
const Purchase_History = require("../models/purchase_history");
const router = new express.Router();

router.post("/admin/login",async (req, res) => {
    // try {
    //     const admin = await Admin.findByCredentials(req.body.email, req.body.password);
    //     const token = await admin.generateAuthToken();
    //     res.send({ admin, token });
    // } catch (e) {
    //     res.status(404).send(e);
    // }
});

router.get("/admin/admin_profile", (req, res) => {
    res.send(adminInfo);
})

router.patch("/admin/admin_update_profile", (req, res) => {
    adminInfo.name = req.body.name;
    adminInfo.address = req.body.address;
    adminInfo.mobile_number = req.body.mobile_number;
    res.status(200).send(adminInfo);
})

router.get("/admin/all_packages", (req, res) => {
    models.Packages.find({}).then((packages) => {
        res.status(200).send(packages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});

router.post("/admin/add_package", async (req, res) => {
    const package = new models.Packages(req.body);
    try {
        await package.save();
        res.send(package);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.patch("/admin/update_package", (req, res) => {
    models.Packages.findOneAndUpdate({ package: req.body.package }, req.body, { new: true }).then((package) => {
        res.status(200).send(package);
    }).catch((e) => {
        res.status(404).send(e);
    })
});

router.delete("/admin/delete_package", (req, res) => {
    models.Packages.findOneAndDelete(req.body, { new: true }).then((package) => {
        if (!package)
            return res.status(404).send("package is not");
        res.send(package);
    }).catch((e) => {
        res.send(e);
    })
});

router.post("/admin/add_message", async (req, res) => {
    const message = new models.Messages(req.body);
    try {
        await message.save();
        res.send(message);
    } catch (e) {
        res.send(404).send(e);
    }
});

router.patch("/admin/update_message", async (req, res) => {
    try {
        const msg = await models.Messages.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.status(200).send(msg);
    } catch (e) {
        res.status(404).send(e)
    }
});

router.get("/admin/all_messages", async (req, res) => {
    models.Messages.find({}).then((messages) => {
        res.status(200).send(messages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});
router.delete("/admin/delete_message", (req, res) => {
    models.Messages.findOneAndDelete(req.body, { new: true }).then((message) => {
        if (!message)
            return res.status(404).send("package is not");
        res.send(message);
    }).catch((e) => {
        res.send(e);
    })
});

router.get("/admin/all_users", async (req, res) => {
    const package = await Purchase_History.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "user_info"
            }
        },
        {
            $lookup: {
                from: "packages",
                localField: "package_id",
                foreignField: "_id",
                as: "package_info"
            }
        },
        {
            $lookup: {
                from: "subcategaries",
                localField: "subcategary_id",
                foreignField: "_id",
                as: "device_info"
            }
        }
    ], function (err, data) {
        return res.json(data);
    });
});

router.delete("/admin/delete_user", (req, res) => {
    Users.findOneAndDelete(req.body, { new: true }).then((user) => {
        if (!user)
            return res.status(404).send("package is not");
        res.send(user);
    }).catch((e) => {
        res.send(e);
    })
});

router.post("/admin/add_subcategary", async (req, res) => {
    const sub_categary = new models.SubCategaries(req.body);
    try {
        await sub_categary.save();
        res.send(sub_categary);
    } catch (e) {
        res.status(404).send(e)
    }
});

router.patch("/admin/update_subcategary", async (req, res) => {
    try {
        const subcategary = await models.SubCategaries.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.status(200).send(subcategary);
    } catch (e) {
        res.status(404).send(e)
    }
});

router.delete("/admin/delete_subcategary", async (req, res) => {
    try {
        const subcategary = await models.SubCategaries.findOneAndDelete(req.body, { new: true });

        res.send(subcategary);
    } catch (e) {
        res.status(404).send("subcategary is not present");
    }
});

router.get("/admin/view_subcategaries", async (req, res) => {
    try {
        const subcategaries = await models.SubCategaries.find({});
        res.status(200).send(subcategaries);
    } catch (e) {
        res.status(400).send(e)
    }
});


module.exports = router;