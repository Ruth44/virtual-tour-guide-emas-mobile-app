var express = require('express');
var router = express.Router();
Categories = require('../models/categoriesModel');
authMiddleware = require('../middlewares/auth');
var ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('jsonwebtoken');
const config = require('../config');


router.get('/', async (req, res, next) => {
    try {
        // const bldgId = req.params.id;
        const bldgId = res.locals.bldgId;
        var roomListRes = await Rooms.find({bldgId: bldgId});
        var counts = {}
        for(const room of roomListRes) {
            counts[room.category] = counts[room.category] ? counts[room.category] + 1: 1;
        }
        var categoriesList = await Categories.find({bldgId: bldgId}).lean();
        if(categoriesList.length == 0) {
            return res.status(404).json({message: "No categories found"});
        }
        for (let i = 0; i < categoriesList.length; i++) {
            element = categoriesList[i];
            categoriesList[i].count = counts[element._id];
        }
        res.json(categoriesList);
    } catch (e) {
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});

router.post('/',  authMiddleware.isAuthenticated, async (req, res, next) => {
    try {
        const bldgId = res.locals.bldgId;
        // console.log({"aaa": req.headers.authorization.split(' ')[1]});
        const token = req.headers.authorization.split(' ')[1];
        // console.log("bbb");
        const decoded = jwt.verify(token, config.secret)
        // const user = await User.findById(decoded.id)
        
        // var fetchedBuilding = await Building.findById(req.body.bldgId).lean();
        var fetchedBuilding = await Building.findById(bldgId);
        console.log({fetchedBuilding: fetchedBuilding});
        var temp = fetchedBuilding.toObject();
        // console.log({"temp ": temp});
        fetchedBuilding = temp;
        const allowedBldgManagers = fetchedBuilding.managers;
        if (!(allowedBldgManagers.includes(decoded.id))) {
            // console.log("x");
            return res.status(403).json({
                message: 'Failed to add category. Insufficient permission for user.',
                error: true
            });
        }else {
            // console.log("ww");
        }
        var existingCategory = await Categories.findOne({name: req.body.name, bldgId: bldgId});
        if (existingCategory) {
            return res.status(409).json({
                status: 'err',
                code: 409,
                message: "category already exists"
            });
        }
        let categories = new Categories()
        categories.name = req.body.name
        categories.bldgId = bldgId
        await categories.save()
        res.json({
            status: 'success',
            code: 200,
            message: 'Register save',
            data: categories
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});



router.get('/:id', async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        if(!ObjectId.isValid(categoryId)) {
            return res.status(404).json({message: "Category not found"});
        }
        // var category = await Categories.findById(req.params.id);
        var category = await Categories.findOne({_id: categoryId});
        
        if(!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        res.json({
            status: 'success',
            code: 200,
            message: "Category Name",
            data: category
        })
    } catch (e) {
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        var category = await Categories.findById(req.params.id);
        category.name = req.body.name;
        await category.save();
        res.json({
            status: 'success',
            code: 200,
            message: "Category Name updated",
            data: category
        })
    } catch (e) {
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});


router.delete('/:id',  authMiddleware.isAuthenticated, async (req, res, next) => {
    try {
        const bldgId = res.locals.bldgId;
        // console.log({"aaa": req.headers.authorization.split(' ')[1]});
        const token = req.headers.authorization.split(' ')[1];
        // console.log("bbb");
        const decoded = jwt.verify(token, config.secret)
        // const user = await User.findById(decoded.id)
        
        // var fetchedBuilding = await Building.findById(req.body.bldgId).lean();
        var fetchedBuilding = await Building.findById(bldgId);
        console.log({fetchedBuilding: fetchedBuilding});
        var temp = fetchedBuilding.toObject();
        // console.log({"temp ": temp});
        fetchedBuilding = temp;
        const allowedBldgManagers = fetchedBuilding.managers;
        if (!(allowedBldgManagers.includes(decoded.id))) {
            // console.log("x");
            return res.status(403).json({
                message: 'Failed to delete category. Insufficient permission for user.',
                error: true
            });
        }else {
            // console.log("ww");
        }
        var roomListRes = await Rooms.find({category: req.params.id});
        // console.log({roomssFound: roomListRes});
        if(roomListRes.length > 0) {
            return res.status(409).json({
                status: 'err',
                code: 409,
                message: "category can't be deleted. One or more rooms have it as category."
            });
        }
        await Categories.deleteMany({ _id: req.params.id });
        res.json({
            status: 'success',
            code: 200,
            message: 'Category Removed'
        })
    } catch (e) {
        res.status(500).json({
            status: 'err',
            code: 500,
            message: e
        });
    }
});


module.exports = router;