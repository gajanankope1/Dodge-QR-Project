const express = require("express");
const Packages = require("../models/admin");
// const Messages=require("../models/admin");
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
    Packages.find({}).then((packages) => {
        res.status(200).send(packages);
    }).catch((e) => {
        res.status(404).send(e);
    });
});

router.post("/admin/add_package", (req, res) => {
    const package = new Packages(req.body);
    package.save(req.body).then(() => {
        res.status(200).send(package);
    }).catch((e) => {
        res.status(404).send(e);
    });
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

// router.post("/admin/add_message",async (req,res)=>{
//     const message= new Messages(req.body);
//     message.save(req.body).then(() => {
//         res.status(200).send(message);
//     }).catch((e) => {
//         res.status(404).send(e);
//     });
// });

module.exports = router;