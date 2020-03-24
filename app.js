var express = require('express');
var app = express();
// import the socket.io library
const io = require('socket.io')(); 
// instantiate the socket.io library right away with the () method -> makes it run
const port = process.env.PORT || 3030;
// tell express where our static files are (js, images, css etc)
app.use(express.static('public'));
//routing
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
//Chat App
const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});



// this is all of our socket.io messaging functionality

// attach socket.io
io.attach(server);

io.on('connection', function(socket) {
    let addedUser = false;
    console.log('user connected');
    socket.emit('connected', { sID: `${socket.id}`, message: 'new connection'});

    
    socket.on('add user', (username) => {
        if (addedUser) return;
        // store the username in socket
        socket.username = username;
        addedUser = true;
        socket.emit('login');
        // echo globally (all clients) that a person has connected
        io.emit('new_message', {
            id: socket.id,
            username: socket.username,
            message: {content: 'I have joined'}
        });
    });

    // listen for an incoming message from a user (socket refers to an individual user)
    // msg is the incoming message from that user
    socket.on('chat_message', function(msg) {
        console.log(msg);

        // when we get a new message, send it to everyone so they see it
        // io is the switchboard operator, making sure everyone who's connected
        // gets the messages
        io.emit('new_message', { id: socket.id, username: socket.username, message: msg })
    })

    // listen for a disconnect event
    socket.on('disconnect', () => {
          // echo globally that this client has left
          io.emit('new_message', {
            id: socket.id,
            username: socket.username,
            message: {content: 'I have left'}
        });
        
    });
})