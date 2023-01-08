let mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  roomName: String,
  roomNumber: {
    type: String,
    unique: true,
  },
  floorNumber: String,
  isEmpty: Boolean,
  x: Number,
  y:Number,
  z:Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    // required: true
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buildings",
    // required: true
  },
  //   bldgId: String,
});

// let rooms = module.exports = mongoose.model('Room', RoomSchema);
// module.exports.get = function(callback ,limit){
//     rooms.find(callback).limit(limit);
// }
let room = mongoose.model("Room", RoomSchema);
module.exports.RoomModel = room;
module.exports.RoomSchema = RoomSchema;
