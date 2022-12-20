const { Router } = require("express");
const router = Router();
const User = require("../models/userModel");
// const verifyToken = require('./verifyToken')
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/auth");
const Building = require("../models/buildingsModel").BuildingModel;

// Signup router
router.post("/signup", authMiddleware.isAuthenticated, async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.userId);
    if (loggedInUser.mainManager !== true) {
      return res
        .status(401)
        .json({
          message: "Unauthorized: Only main managers can add new bldg managers",
        });
    }

    const { name, email, password } = req.body;
    var similarEmailUser = await User.findOne({ email });
    if (similarEmailUser) {
      return res
        .status(409)
        .json({ message: "User with specified email already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      mainManager: false,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    var blgdList = await Building.find();
    for (let i = 0; i < blgdList.length; i++) {
      currBldg = blgdList[i];
      if (currBldg.managers.includes(loggedInUser._id)) {
        currBldg.managers.push(user._id);
        await currBldg.save();
        break;
      }
    }
    // await blgdList.save();
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).send("Please try again");
  }
});

// Login router
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    // console.log({userfetched: user});
    if (!user) {
      return res.status(404).send("User does not exist");
    }
    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    // if (!validPassword) {
    //     return res.status(401).send({ auth: false, token })
    // } else {
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: "24h",
    });
    res.status(200).json({ auth: true, token, mainManager });

    // }
  } catch (e) {
    console.log(e);
    res.status(500).send('Please try again , "Can not Login"');
  }
});

// Logout router

router.get("/logout", function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

// Change password
router.post(
  "/change-password",
  authMiddleware.isAuthenticated,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userId });
      console.log({ user });

      if (!user) {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: "User does not exist",
        });
      }
      if (req.body.oldPassword == null) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "old password not provided",
        });
      }
      if (req.body.newPassword == null) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "New password not provided",
        });
      }
      const validOldPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!validOldPassword) {
        return res.status(403).json({
          status: "error",
          code: 403,
          message: "Invalid old password",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
      await user.save();
      res.status(200).json({
        status: "success",
        code: 200,
        message: "Password successfully changed",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: "error",
        code: 500,
        message: "Unknown error",
      });
    }
  }
);

module.exports = router;
