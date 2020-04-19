// Set the port as either the port being used by the external system/platform (i.e. heroko)
// Or, if the process.env is not set (i.e. server is running locally) then just set the port to 3000
var PORT = process.env.PORT || 3000;
// Load the express framework
var express = require('express');
// Create the app instance (using express)
var app = express();
// Load the http framework and pass it the server
var http = require('http').Server(app);
// Load socket.io and pass it the 'http' instance
var io = require('socket.io')(http);
// Load moment helper for timestamps
const moment = require('moment');

// Tell the app where the public files are so that it can load the files (i.e. index.html)
// When it is created. 
app.use(express.static(__dirname + '/public'));

// Special variable built into Sockets.IO which stores all of the client info.
// i.e. The information for the socket/user
const clientInfo = {};

// Sends current users to the provided socket
const sendCurrentUsers = socket => {
    // get the info for this current socket
    const info = clientInfo[socket.id];
    const users = [];

    // Return if there is no client info
    if (typeof info === 'undefined') {
        return;
    }

    // Loop over client info and push to array
    Object.keys(clientInfo).map(socketId => {
        const userInfo = clientInfo[socketId];
        if (info.room === userInfo.room) {
            users.push(userInfo.name);
        }
    });

    // Return the result for just that single socket
    // socket.emit('message', {
    //     name: 'System',
    //     text: 'Current users: ' + users.join(', '),
    //     timestamp: moment().valueOf()
    // });

    // Instead send for everyone in the room by emiting a message
    // with the fields to display
    io.to(clientInfo[socket.id].room).emit('message', {
        name: 'System',
        text: 'Current users: ' + users.join(', '),
        timestamp: moment().valueOf()
    });
};

// UPON THE IO CONNECTION EVENT FIRING
io.on('connection', socket => {
    console.log('User connected via socket.io!');
    const now = moment();

    // The server listens for the 'joinRoom' event
    socket.on('joinRoom', req => {
        clientInfo[socket.id] = req;
        socket.join(req.room);
        // And uses 'broadcast' to fire off a message to other sockets 
        // apart from itself (i.e. all other users) 
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: req.name + ' has joined this room',
            timestamp: moment().valueOf()
        })
    });

    // The server listens for the 'message' event
    socket.on('message', message => {
        console.log('Message received: ' + message.text);
        message.timestamp = now.valueOf();
        io.to(clientInfo[socket.id].room).emit('message', message);
        // socket.broadcast.emit('message', message); // Only emits to everyone but current socket (i.e. send to everyone but you, the sender)

        // Checks for special command of '@currentUsers'
        if (message.text === '@currentUsers') {
            sendCurrentUsers(socket);
        }
    });

    // The server listens for a socket disconnecting
    socket.on('disconnect', () => {
        const userData = clientInfo[socket.id];
        // Print the message that the user has left
        if (typeof userData !== 'undefined') {
            socket.leave(userData.room);
            io.to(userData.room).emit('message', {
                name: 'System',
                text: userData.name + ' has left!',
                timestamp: moment().valueOf()
            });
            delete userData;
        }
    });
});

// Setup the http instance to listen when the port is connected to
// i.e (WHen the server is started)
http.listen(PORT, function () {
    console.log('Server started!');
});