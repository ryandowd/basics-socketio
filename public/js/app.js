// Load socket.io 
const socket = io();
// Uses a 3rd party func to grab 'name' from url query param
const name = getQueryVariable('name') || '';
// Uses a 3rd party func to grab 'room' from url query param
const room = getQueryVariable('room') || '';

// If the 'name' and 'room' vars exist then print them to the UI
if (name && room) {
    console.log(`${name} wants to join '${room}'`);
    jQuery('.roomTitle').append(`Room: ${room}`);
}

// ON THE SOCKET CONNECT EVENT
socket.on('connect', () => {
    console.log('Connected to SocketIO server');

    // If name and room exist
    if (name && room) {
        // Emit (i.e. trigger/broadcast/call) the custom socket 
        // call 'Join Room' with the name and room. This is so 
        // that the socket on the server side can pick it up
        socket.emit('joinRoom', {
            name: name,
            room: room
        });
    }
});

// Format time helper using 'moment.js'
const formatTime = message => {
    const timestamp = moment.utc(parseInt(message.timestamp));
    return timestamp.local().format('h:mm a');
};

// ON THE SOCKET MESSAGE EVENT
socket.on('message', message => {
    // Speend the message details to the page
    // i.e. (User name, timestamp, message text)
    console.log('New Message: ');
    const $messages = jQuery('.messages');
    const time = formatTime(message);
    $messages.append(`<p> ${message.name} | ${time}: <br /> ${message.text}</p> `);
});

// Handles submitting of new message
const $form = jQuery('#message-form');

// jQuery to handle the sumbit of the form
$form.on('submit', event => {
    event.preventDefault();
    const $inputMessage = $form.find('input[name=message]');
    // Emit (i.e broadcast) the 'message' call 
    // so that the socket on the server side can pick it up
    socket.emit('message', {
        name: name,
        text: $inputMessage.val()
    });
    $inputMessage.val('');
});