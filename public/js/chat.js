//Our own client side JS file
const socket = io() //connecting to the server!!


const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')


socket.on('message',(greet) =>{
    console.log(greet)
})

$messageForm.addEventListener('submit',(e) => {

    e.preventDefault(); //To prevent a full page refresh.
    $messageFormButton.setAttribute('disabled', 'disabled') //Disabling till the message is delivered

    const message = e.target.elements.message.value //e then target (which is form here) then the name of the input--message variable.. and then its value..

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
   // navigator.geolocation -: Returns a Geolocation object allowing accessing the location of the device
   
    if (!navigator.geolocation) { //if geolocation is not supported in user's broser
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { //position is an object from which we will access the lat and long 
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})