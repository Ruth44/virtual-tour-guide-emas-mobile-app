const express = require('express')
const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }))
// app.use(require('./controllers/route_controller'))
var authRouter = require('./controllers/authController');
var bldgRouter = require('./controllers/buildingsController');
var categoryRouter = require('./controllers/categoriesController');
var roomRouter = require('./controllers/roomController');
var userRouter = require('./controllers/user_controller');

app.use("/buildings", bldgRouter);
app.use("/categories", categoryRouter);
app.use("/rooms", roomRouter);
app.use("/users", userRouter);
app.use("/", authRouter);


module.exports = app;