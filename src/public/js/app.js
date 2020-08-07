const io = window.io('/');

console.log('client test')

io.on('event', (event) => {
    console.log('hallelujah')
    console.log(event)
})