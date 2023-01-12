let mongoose = require("mongoose");
// This is a schema class that helps us to model the data we will store in the database. 
//The fields for the Room table along with their Data Type is listed inside of this class.
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

  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buildings",

  },

});


let room = mongoose.model("Room", RoomSchema);
module.exports.RoomModel = room;
module.exports.RoomSchema = RoomSchema;
