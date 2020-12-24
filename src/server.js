const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('chat.html');
});

let messages = [];

io.on('connect', socket => {

  socket.emit('loadMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('newMessage', data);
  });
});

http.listen(3333, () => {
  console.log('server running');
});