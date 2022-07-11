const express = require("express");
const helper = require("../middlewere/helper");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin/admin");
const Messages = require("../models/admin/messages");
const Packages= require("../models/admin/packages");
const SubCategaries= require("../models/admin/subcategaries");
const Users = require("../models/users");
const adminAuth = require("../middlewere/adminAuth");
const Purchase_History = require("../models/purchase_history");
const router = new express.Router();

const JWT_SECRET = "some super secret";

router.post("/admin/login", async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password);
        const token = await admin.generateAuthToken();
        res.send({ admin, token });
    } catch (e) {
        res.status(404).send(e);
    }
});

router.post("/admin/forgot-password", async (req, res, next) => {
    const admin = await Admin.findOne({ email: req.body.email })
    if (!admin) {
        return res.send("admin is not registered");
    } else {
        const secret = JWT_SECRET + admin.password;
        const payload = {
            email: admin.email,
            _id: admin._id
        }
        const token = jwt.sign(payload, secret, { expiresIn: "10m" });
        const link = `http://localhost:3000/admin/reset-password/${admin._id}/${token}`;
        helper(admin.email, link);
        res.send("Reset Password Link send on your email");
    }
})

router.get("/admin/reset-password/:id/:token", (req, res, next) => {
    res.render("index");
})

router.post("/admin/reset-password/:id/:token", async (req, res, next) => {
    try {
        if (req.body.newpassword == req.body.confirmpassword) {
            await Admin.findByIdAndUpdate({ _id: req.params.id }, { password: req.body.newpassword }, { new: true });
            res.send("password updaed")
        }
        else {
            res.send("both passwords does not match");
        }
    } catch (e) {
        res.send(e.message);
    }
})



router.post("/admin/admin_logout", adminAuth, async (req, res) => {
    try {
        res.status(200).send("looged Out");
    } catch (e) {
        res.status(404).send(e)
    }
});

router.get("/admin/admin_profile", adminAuth, (req, res) => {
    res.send(req.admin);
})

router.patch("/admin/admin_update_profile", adminAuth, async (req, res) => {
    try {
        const admin = await Admin.findOneAndUpdate({ _id: req.admin._id }, req.body, { new: true });
        res.status(200).send(admin)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.get("/admin/all_packages", (req, res) => {
    Packages.find({}).then((packages) => {
        res.status(200).send(packages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});

router.post("/admin/add_package", async (req, res) => {
    const package = new Packages(req.body);
    try {
        await package.save();
        res.send(package);
    } catch (e) {
        res.status(404).send(e);
    }
});

router.patch("/admin/update_package", (req, res) => {
    Packages.findOneAndUpdate({ package: req.body.package }, req.body, { new: true }).then((package) => {
        res.status(200).send(package);
    }).catch((e) => {
        res.status(404).send(e);
    })
});

router.delete("/admin/delete_package", (req, res) => {
    Packages.findOneAndDelete(req.body, { new: true }).then((package) => {
        if (!package)
            return res.status(404).send("package is not");
        res.send(package);
    }).catch((e) => {
        res.send(e);
    })
});

router.post("/admin/add_message", async (req, res) => {
    const message = new Messages(req.body);
    try {
        await message.save();
        res.send(message);
    } catch (e) {
        res.send(404).send(e);
    }
});

router.patch("/admin/update_message", async (req, res) => {
    try {
        const msg = await Messages.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.status(200).send(msg);
    } catch (e) {
        res.status(404).send(e)
    }
});

router.get("/admin/all_messages", async (req, res) => {
    Messages.find({}).then((messages) => {
        res.status(200).send(messages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});
router.delete("/admin/delete_message", (req, res) => {
    Messages.findOneAndDelete(req.body, { new: true }).then((message) => {
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
    const sub_categary = new SubCategaries(req.body);
    try {
        await sub_categary.save();
        res.send(sub_categary);
    } catch (e) {
        res.status(404).send(e)
    }
});

router.patch("/admin/update_subcategary", async (req, res) => {
    try {
        const subcategary = await SubCategaries.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true });
        res.status(200).send(subcategary);
    } catch (e) {
        res.status(404).send(e)
    }
});

router.delete("/admin/delete_subcategary", async (req, res) => {
    try {
        const subcategary = await SubCategaries.findOneAndDelete(req.body, { new: true });

        res.send(subcategary);
    } catch (e) {
        res.status(404).send("subcategary is not present");
    }
});

router.get("/admin/view_subcategaries", async (req, res) => {
    try {
        const subcategaries = await SubCategaries.find({});
        res.status(200).send(subcategaries);
    } catch (e) {
        res.status(400).send(e)
    }
});


module.exports = router;