const app = require("../../app");
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.post('/socket', (req, res) => {

    console.log(req.body);
    res.status(200).send("Success");
    res.status(201).send("Created");
    res.status(202).send("Accepted");
    res.status(404).send("Not found");

    socket.emit('clientEvent', "post")
})

io.on('connection', socket => {
    console.log("user connected: " + socket.client.id);
    socket.on('serverEvent', data => {
        console.log('new message from client: ' + data);
    })

    socket.emit('clientEvent', "hey");
})

http.listen(3000, () => {
    console.log("listening to port 3000");
})
