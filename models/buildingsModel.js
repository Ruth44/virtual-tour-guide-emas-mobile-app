let mongoose = require('mongoose');
let roomSchema = require('./roomModel');


let buildingSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    rooms: {
        type: [roomSchema.RoomSchema],
    },
    managers: {
        type: [String],
        required: true
    }
});

let building =  mongoose.model('Buildings', buildingSchema);
module.exports.BuildingModel = building;
module.exports.BuildingSchema = buildingSchema;