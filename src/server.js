require('dotenv').config();

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const path = require('path');
const cors = require('cors');

app.use(cors());
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

http.listen(process.env.PORT || 3333, () => {
  console.log(`server running on ${process.env.APP_URL}`);
});