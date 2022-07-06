const express = require("express");
const models = require("../models/admin");
const Users=require("../models/users");
const router = new express.Router();

const adminInfo = {
    email: "admin@gmail.com",
    password: "admin@12"
}

router.get("/admin/login", (req, res) => {
    if (JSON.stringify(adminInfo) == JSON.stringify(req.body)) {
        res.status(200).send(adminInfo);
    }
    else {
        res.status(404).send("Enter Currect Credentials");
    }
});

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
    Users.find({}).then((users) => {
        res.status(200).send(users);
    }).catch((e) => {
        res.status(404).send(e);
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


module.exports = router;