var express = require('express');
var app = express();

const io = require('socket.io')();
// ^^ instantiate the socket.io Library right away with the () method --> makes it run //

const port = process.env.PORT || 3030;

// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// this is all our socket.io messaging functionality //

// attach socket.io //
io.attach(server);

io.on('connection', function(socket) {
    console.log('user connected');

// listen for disconnect event //
    socket.on('disconnect', function() {
        console.log('a user disconnected');
    })
});