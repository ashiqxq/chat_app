const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput  = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
socket.on('message', (message)=>{
    console.log(message);
})

$messageForm.addEventListener('submit', 
        (e)=>{
            e.preventDefault();
            $messageFormButton.setAttribute('disabled', 'disabled')
            $messageFormInput.value = ''
            $messageFormInput.focus()
            const message = e.target.elements.message.value;
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

 
