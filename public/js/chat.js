const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput  = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true })

socket.on('message', (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message)=>{
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', 
        (e)=>{
            e.preventDefault();
            const message = e.target.elements.message.value;
            $messageFormButton.setAttribute('disabled', 'disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()
            
            socket.emit('sendMessage', message, (error)=>{
                $messageFormButton.removeAttribute('disabled')
                if (error){
                    return console.log(error)
                }
                console.log("Message delivered");
            });
})

$sendLocationButton.addEventListener(
            'click', ()=>{
                if (!navigator.geolocation){
                    return alert('geolocation is not supported by your browser');
                }
                $sendLocationButton.setAttribute('disabled', 'disabled')
                current_location = navigator.geolocation.getCurrentPosition((locData)=>{
                     socket.emit('sendLocation', `https://google.com/maps?q=${locData.coords.latitude},${locData.coords.longitude}`, 
                     ()=>{
                         $sendLocationButton.removeAttribute('disabled')
                        console.log("location shared!")
                     });
                    // return locData.coords;
                })             
            }
)

 
socket.emit('join', {username, room})