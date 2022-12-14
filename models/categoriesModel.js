let mongoose = require('mongoose');


let categoriesSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bldgId: {
        type: String,
    }
});

module.exports = mongoose.model('Categories', categoriesSchema);
// let categories = module.exports = mongoose.model('Categories', categoriesSchema);
// module.exports.get = function (callback, limit) {
//     categories.find(callback).limit(limit);
// }