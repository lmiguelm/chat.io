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

const messages = [];
const users = [];

io.on('connect', socket => {

  socket.emit('loadData', {messages, users});

  socket.on('new-user', data => {
    users.push({ id: socket.id, name: data });
    socket.broadcast.emit('new-user', {  name: data, msg: 'acabou de se conectar.' });
  });

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('newMessage', data);
  });

  socket.on('disconnect', () => {

    const [{name}] = users.filter(user => user.id == socket.id);
    users.filter(user => user.id != socket.id);

    if(name != 'undefined') {
      socket.broadcast.emit('user-disconnected', { name , msg: 'acabou de se desconectar' })
    }
  });
});

http.listen(process.env.PORT || 3333, () => {
  console.log(`server running on ${process.env.APP_URL}`);
});