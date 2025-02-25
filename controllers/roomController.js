var express = require("express");
const authMiddleware = require("../middlewares/auth");
var router = express.Router();
Rooms = require("../models/roomModel").RoomModel;
Category = require("../models/categoriesModel");
Building = require("../models/buildingsModel").BuildingModel;
const jwt = require("jsonwebtoken");
const config = require("../config");


// Get all the available rooms from the database

router.get("/", async (req, res, next) => {
  try {
    const bldgId = req.body.bldgId;
    var roomListRes = await Rooms.find({ bldgId: bldgId });

    for (let i = 0; i < roomListRes.length; i++) {
      element = roomListRes[i];
      var fetchedCategory = await Category.findById(element["category"]);
      roomListRes[i]["category"] = fetchedCategory;
    }
    res.json(roomListRes);
  } catch (e) {
    // next(e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});
// Create a new room(destination)
router.post("/", authMiddleware.isAuthenticated, async (req, res, next) => {
  try {
    // console.log({"aaa": req.headers.authorization.split(' ')[1]});
    const token = req.headers.authorization.split(" ")[1];
    // console.log("bbb");
    const decoded = jwt.verify(token, config.secret);
    // const user = await User.findById(decoded.id)
    console.log(req.body);
    // var fetchedBuilding = await Building.findById(req.body.bldgId).lean();
    var fetchedBuilding = await Building.findOne({ _id: req.body.building });
    var temp = fetchedBuilding.toObject();
    console.log("fetchedbldg", fetchedBuilding);
    // console.log({"temp ": temp});
    fetchedBuilding = temp;
    const allowedBldgManagers = fetchedBuilding.managers;
    console.log(allowedBldgManagers);

    if (!allowedBldgManagers.includes(decoded.id)) {
      // console.log("x");
      return res.status(403).json({
        message: "Insufficient permission for user.",
        error: true,
      });
    }

    var fetchedCategory = await Category.findOne({
      name: req.body.category,
    });
    const resCategory = fetchedCategory["_id"];

    let room = new Rooms({
      roomName: req.body.roomName,
      roomNumber: req.body.roomNumber,
      floorNumber: req.body.floorNumber,
      isEmpty: req.body.isEmpty,
      x: req.body.x,
      y: req.body.y,
      z: req.body.z,
      category: resCategory,
      building: fetchedBuilding,
    });
    await room.save();
    // var currBldg = await Building.findOne({ buildingId: buildingId });
    // for (let i = 0; i < blgdList.length; i++) {
    //   currBldg = blgdList[buildingId];

    // if (!currBldg.managers.includes(loggedInUser._id)) {
    var fetchedBuilding = await Building.findOne({ _id: req.body.building });

    console.log(room);
    fetchedBuilding.rooms.push(room);
    // console.log(fetchedBuilding.rooms);
    await fetchedBuilding.save();
    res.json({
      status: "success",
      code: 200,
      message: "Room added",
      data: room,
    });
  } catch (e) {
    // next(e);
    console.log("errr " + e);
    res.status(500).json({
      status: "err",
      code: 500,
      message: e,
    });
  }
});

// Get a specific room(destinations) from the database

router.get("/:id", async (req, res, next) => {
  try {
    var fetchedRoom = await Rooms.findById(req.params.id);
    var fetchedCategory = await Category.findById(fetchedRoom["category"]);
    fetchedRoom["category"] = fetchedCategory;
    res.json({
      status: "success",
      code: 200,
      message: "Room Name",
      data: fetchedRoom,
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
// Update a specific room(destination) on the database

router.put("/:id", async (req, res, next) => {
  try {
    var fetchedRoom = await Rooms.findById(req.params.id);
    var returnedData = fetchedRoom.toObject();
    fetchedRoom.roomName = req.body.roomName;
    fetchedRoom.isEmpty = req.body.isEmpty;
    returnedData.isEmpty = req.body.isEmpty;
    console.log("bodydataa", req.body);
    // if (req.body.isEmpty) {
    //   fetchedRoom.roomName = "NO NAME";
    //   returnedData.roomName = "NO NAME";
    // }
    if (req.body.category) {
      var fetchedCategory = await Category.findOne({
        name: req.body.category,
      });
      console.log(fetchedCategory);
      fetchedRoom.category = fetchedCategory._id;
      returnedData.category = fetchedCategory;
    } else {
      returnedData.category = {
        name: "NO CATEGORY",
        _id: "NOid",
        createdAt: Date.now(),
      };
    }
    // if (req.body.bldgName) {
    //   var fetchedBuilding = await Building.findOne({ name: req.body.bldgName });
    //   fetchedRoom.building = fetchedBuilding._id;
    //   returnedData.building = fetchedBuilding;
    // } else {
    //   returnedData.building = {
    //     name: "NO BUILDING",
    //     _id: "NOid",
    //     createdAt: Date.now(),
    //   };
    // }
    await fetchedRoom.save();
    res.json({
      status: "success",
      code: 200,
      message: "Room Name updated",
      data: returnedData,
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
// Delete a specific room(destinations) from the database

router.delete("/:id", async (req, res, next) => {
  console.log(req.params.id);
  try {
    var roomToDelete = await Rooms.findById(req.params.id);
    console.log("j", roomToDelete);
    var fetchedBuilding = await Building.findById(roomToDelete.building);

    fetchedBuilding.rooms.pop(roomToDelete);
    await fetchedBuilding.save();

    await Rooms.deleteOne({ _id: req.params.id });
    res.json({
      status: "success",
      code: 200,
      message: "Room is Removed",
    });

    // console.log(fetchedBuilding.rooms);
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
