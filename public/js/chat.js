//Our own client side JS file
const socket = io() //connecting to the server!!

socket.on('message',(greet) =>{
    console.log(greet)
})

document.querySelector('#message-form').addEventListener('submit',(e) => {

    e.preventDefault(); //to prevent a full page refresh.
    const message = e.target.elements.message.value //e then target (which is form here) then the name of the input--message variable.. and then its value..

    socket.emit('sendMessage' , message)
})