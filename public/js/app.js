const socket = io();

socket.on('connect', () => {
    console.log('Connected to SocketIO server');
});

socket.on('message', message => {
    console.log('New Message: ');
    console.log(message.text);

    const $messages = jQuery('.messages');
    $messages.append(`<p>${message.text}</p>`);
});

// Handles submitting of new message
const $form = jQuery('#message-form');

$form.on('submit', event => {
    event.preventDefault();
    const $inputMessage = $form.find('input[name=message]');
    socket.emit('message', {
        text: $inputMessage.val()
    });
    $inputMessage.val('');
});