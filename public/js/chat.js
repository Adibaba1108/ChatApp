//Our own client side JS file
const socket = io() //connecting to the server!!


const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages') //it is the location where we want to render our template

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML//what we realy need is the html contained inside(innerHTML)

 
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message //this is an object and we provide a key value pair and value will be get injected to the {{message }}in in the html file and we will render that 
    })
    $messages.insertAdjacentHTML('beforeend', html)//this allows other HTML adjacent to the element we've selected here our message
    //beforeend would add new messages(here message is in variable html) at the bottom inside of the div.
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
            return console.log(error) //if callback came with argument means it is an error and we return it.
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
        }, () => { //acknowledgement here is nothing but callback we receive
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})