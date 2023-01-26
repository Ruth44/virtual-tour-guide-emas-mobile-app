var express = require("express");
var router = express.Router();
User = require("../models/userModel");
Building = require("../models/buildingsModel").BuildingModel;

router.get("/", async (req, res, next) => {
  try {
    var userListRes = await User.find({});
    res.json(userListRes);
  } catch (e) {
    // next(e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    var user = await User.findById(req.params.id);
    res.json({
      status: "success",
      code: 200,
      message: "Users List",
      data: user,
    });
  } catch (e) {
    // next(e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});
router.get("/bldg/:id", async (req, res, next) => {
  try {
    //var bldg = await Building.findById(req.params.id);
    var users = await User.find({ buildingId: req.params.id });
    console.log(users);
    res.json({
      status: "success",
      code: 200,
      message: "Users List",
      data: users,
    });
  } catch (e) {
    // next(e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    var user = await User.findById(req.params.id);
    user.name = req.body.name;
    user.email = req.body.email;

    await user.save();
    res.json({
      status: "success",
      code: 200,
      message: "User updated",
      data: user,
    });
  } catch (e) {
    // next(e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.json({
      status: "success",
      code: 200,
      message: "User is deleted",
    });
  } catch (e) {
    // next(e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});

module.exports = router;
