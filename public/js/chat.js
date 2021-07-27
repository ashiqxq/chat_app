const socket = io()

socket.on('message', (message)=>{
    console.log(message);
})

document.querySelector('#message-form')
    .addEventListener('submit', 
        (e)=>{
            e.preventDefault();
            const message = e.target.elements.message.value;
            socket.emit('sendMessage', message, (error)=>{
                if (error){
                    return console.log(error)
                }
                console.log("Message delivered");
            });
})

document.querySelector('#send-location').addEventListener(
            'click', ()=>{
                if (!navigator.geolocation){
                    return alert('geolocation is not supported by your browser');
                }
                current_location = navigator.geolocation.getCurrentPosition((locData)=>{
                     socket.emit('sendLocation', `https://google.com/maps?q=${locData.coords.latitude},${locData.coords.longitude}`, 
                     ()=>{
                        console.log("location shared!")
                     });
                    // return locData.coords;
                })             
            }
)

 
