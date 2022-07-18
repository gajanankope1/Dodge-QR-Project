const express = require("express");
const helper = require("../middlewere/helper");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const Purchase_History = require("../models/purchase_history");
const Packages = require("../models/admin/packages");
const SubCategaries = require("../models/admin/subcategaries");
const Messages = require("../models/admin/messages");
const checkAuthenticated = require("../middlewere/googleAuth");
const auth = require("../middlewere/auth");
const router = new express.Router();

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "868427010265-j10im9mk0h35er7oj4htou7qq6rrk18l.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const JWT_SECRET = "some super secret";

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
    const user = await Users.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/users/loginwithgoogle", (req, res, next) => {
  res.render("login");
});

router.post("/users/loginwithgoogle", (req, res) => {
  let token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = new Users({
      name: payload.name,
      whatsapp_primary_number: 7878787865,
      emergency_number: 8978563412,
      email: payload.email,
      password: payload.at_hash,
      address: "pune,maharashtra",
      google_token: token,
    });
    await user.save();
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      console.log("loggin successfully");
    })
    .catch(console.error);
});

router.get("/google_profile", checkAuthenticated, (req, res) => {
  res.send(req.user);
});

router.post("/users/user_logout", auth, async (req, res) => {
  try {
    res.status(200).send("looged Out");
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/users/forgot-password", async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.send("user is not registered");
  } else {
    const secret = JWT_SECRET + user.password;
    const payload = {
      email: user.email,
      _id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "10m" });
    const link = `http://localhost:3000/users/reset-password/${user._id}/${token}`;
    helper(user.email, link);
    res.send("Reset Password Link send on your email");
  }
});

router.get("/users/reset-password/:id/:token", (req, res, next) => {
  res.render("index");
});

router.post("/users/reset-password/:id/:token", async (req, res, next) => {
  try {
    if (req.body.newpassword == req.body.confirmpassword) {
      await Users.findByIdAndUpdate(
        { _id: req.params.id },
        { password: req.body.newpassword },
        { new: true }
      );
      res.send("password updated");
    } else {
      res.send("both passwords does not match");
    }
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/users/user_profile", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/update_user_profile", auth, async (req, res) => {
  try {
    const user = await Users.findOneAndUpdate({ _id: req.user._id }, req.body, {
      new: true,
    });
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/users/all_Packages", auth, (req, res) => {
  Packages.find({})
    .then((packages) => {
      res.status(200).send(packages);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
});

router.post("/users/purchase_package", auth, async (req, res) => {
  const user_id = req.user._id;
  const package_id = req.body.package_id;
  const obj = {
    user_id,
    package_id,
  };

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
    devicelink_date: new Date(),
  };
  try {
    const packages = await Purchase_History.find({
      user_id: req.user._id,
      package_id: req.body.package_id,
    });
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i];
      const val = pkg.subcategary_id;
      if (req.body.subcategary_id == val) {
        res.status(400).send("divice allready linked to that package");
        break;
      } else if (!val) {
        myfun();
        res.status(200).send("QR code send to your email");
        break;
      }
      async function myfun() {
        await Purchase_History.updateOne({ _id: pkg._id }, select_device, {
          new: true,
        });
        const link = `http://localhost:3000/users/device-link/${req.user._id}/${req.body.package_id}/${req.body.subcategary_id}`;
        await qrcode.toDataURL(link, function (err, url) {
          helper(req.user.email, url);
        });
        return;
      }
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/users/device-link/:uid/:pid/:sid", async (req, res, next) => {
  const user = await Users.findOne({ _id: req.params.uid });
  const package1 = await Packages.findOne({ _id: req.params.pid });
  const deviceInfo = await SubCategaries.findOne({ _id: req.params.sid });
  var message = [];
  for (let i = 0; i < deviceInfo.messages.length; i++) {
    const msg = await Messages.findOne({ _id: deviceInfo.messages[i]._id });
    message[i] = msg.message;
  }
  console.log(message);
  res.render("qrinfo", {
    package: package1.package,
    package_price: package1.price,
    package_message: package1.message,
    package_call: package1.call,

    user_name: user.name,
    user_address: user.address,
    whatsaap_number: user.whatsapp_primary_number,
    call_number: user.emergency_number,

    device_name: deviceInfo.title,
    device_messages: message,
  });
});

router.get("/users/purchase_history", auth, async (req, res) => {
  const package1 = await Purchase_History.aggregate(
    [
      {
        $match: {
          user_id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "packages",
          localField: "package_id",
          foreignField: "_id",
          as: "package_info",
        },
      },
      {
        $lookup: {
          from: "subcategaries",
          localField: "subcategary_id",
          foreignField: "_id",
          as: "device_info",
        },
      },
    ],
    function (err, data) {
      return res.json(data);
    }
  );
});

module.exports = router;
