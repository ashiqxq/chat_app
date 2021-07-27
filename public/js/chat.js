const socket = io()

socket.on('message', (message)=>{
    console.log(message);
    console.log("break");
})

document.querySelector('#message-form')
    .addEventListener('submit', 
        (e)=>{
            e.preventDefault();
            const message = e.target.elements.message.value;
            socket.emit('sendMessage', message);
})

document.querySelector('#send-location').addEventListener(
            'click', ()=>{
                if (!navigator.geolocation){
                    return alert('geolocation is not supported by your browser');
                }
                current_location = navigator.geolocation.getCurrentPosition((locData)=>{
                     socket.emit('sendLocation', `https://google.com/maps?q=${locData.coords.latitude},${locData.coords.longitude}`);
                    // return locData.coords;
                })             
            }
)

 