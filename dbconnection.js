const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ruth:emas12345678@emas.7wwdddl.mongodb.net/test',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
}).then(db => console.log('connection established successfully'))