const io = window.io('/');

console.log('client test')

io.on('event', (event) => {
    console.log('hallelujah')
    console.log(event)
})
/*
io.on('connection', (socket) => {
    console.log('client connected to socket')
    socket.on('event', (event) => {
        console.log(event)
    })
})*/

