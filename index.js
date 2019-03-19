require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
var socketio = require('socket.io');
let router = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// app.use(express.cookieParser());
app.use(bodyParser());
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const option = {
    socketTimeoutMS: 0,
    connectTimeoutMS: 0,
    useNewUrlParser: true
};
// connect to db
mongoose.connect('mongodb://dbUser:user123@ds127094.mlab.com:27094/custom_users', option, function (err) {
    if (err)
        console.log(err);
    else
        console.log('connected..')
});


app.use(cors());

const apiRoutes = require('./routes/api');


// Routes setup
app.use('/api', apiRoutes);


app.get("/", (req, res) => {
    res.send("<h3>Har Har Mahadev<\h3>")
})
// app.use('/routes',root);
let appSocket = app.listen(3500, function (req, res) {

    console.log('server is runnig on port 3500');
});
var io = socketio(appSocket);
io.on('connection', (socketio) => {

    console.log('made socket connection', socketio.id);

    // Handle chat event
    socketio.on('userConnected', function (data) {
        console.log('userConnected', data);
        io.sockets.emit('userConnected', data);
    });

    // Handle typing event
    socketio.on('userDisconnected', function (data) {
        console.log('userDisconnected', data);
        socketio.broadcast.emit('userDisconnected', data);
    });

});


module.exports = router;
