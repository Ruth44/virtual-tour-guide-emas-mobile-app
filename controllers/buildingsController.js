var express = require('express');
var router = express.Router();
Building = require('../models/buildingsModel').BuildingModel;
Rooms = require('../models/roomModel').RoomModel;
authMiddleware = require('../middlewares/auth');
var ObjectId = require('mongoose').Types.ObjectId;
var categoryRouter = require('./categoriesController');


router.get('/', async (req, res, next) => {
    try {
        var bldgListRes = await Building.find({});
        res.json(bldgListRes);
    } catch (e) {
        // next(e);
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});

router.use('/:id/categories',async (req, res, next) => {
    const bldgId = req.params.id;
    if(!ObjectId.isValid(bldgId)) {
        return res.status(404).json({message: "Bldg not found"});
    }
    var bldgRes = await Building.findOne({_id: bldgId});
    if (!bldgRes) {
        return res.status(404).json({message: "Bldg not found"});
    }
    res.locals.bldgId = req.params.id;
    return next()
}, categoryRouter );

router.get('/:id', async (req, res, next) => {
    try {

        const bldgId = req.params.id;
        // var bldgRes = await Building.findById(bldgId)
        if(!ObjectId.isValid(bldgId)) {
            return res.status(404).json({message: "Bldg not found"});
        }
        var bldgRes = await Building.findOne({_id: bldgId});
        if (!bldgRes) {
            return res.status(404).json({message: "Bldg not found"});
        } 
        bldgRes = bldgRes.toObject();
        var roomListRes = await Rooms.find({bldgId: bldgId});
        
        for (let i = 0; i < roomListRes.length; i++) {
            element = roomListRes[i];
            var fetchedCategory = await Category.findById(element["category"]);
            roomListRes[i]["category"] = fetchedCategory;
        }
        bldgRes.rooms = roomListRes;
        
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'Building loaded successfully',
            data: bldgRes
        })

    } catch (e) {
        // next(e);
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});


router.get('/:id/:roomCategoryId', async (req, res, next) => {
    try {
        var roomCategoryId = req.params.roomCategoryId;
        const requiredCategory = await Category.findById(roomCategoryId);
        
        const bldgId = req.params.id;
        var bldgRes = await Building.findById(bldgId).lean();
        
        var roomListRes = [];
        if (requiredCategory) {
            roomListRes = await Rooms.find({bldgId: bldgId, category: requiredCategory._id});
            for (let i = 0; i < roomListRes.length; i++) {
                element = roomListRes[i];
                roomListRes[i]["category"] = requiredCategory;
            }
        }
        
        bldgRes.rooms = roomListRes;
        
        res.json({
            status: 'success',
            code: 200,
            message: 'Buildings Name',
            data: bldgRes
        })

    } catch (e) {
        // next(e);
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});

module.exports = router;