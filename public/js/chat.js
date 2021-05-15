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

document.querySelector('#send-location').addEventListener('click', () => {
   // navigator.geolocation -: Returns a Geolocation object allowing accessing the location of the device
   
    if (!navigator.geolocation) { //if geolocation is not supported in user's broser
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { //position is an object from which we will access the lat and long 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})