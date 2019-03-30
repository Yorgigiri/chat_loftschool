var express = require('express'); // Подключаем express
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var log4js = require('log4js');
var logger = log4js.getLogger();

var port = 3000;

logger.debug('Script has been started...'); // Логгируем.

app.use(express.static(__dirname + '/app'));


io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg, userName) {
        io.emit('chat message', msg, userName);
        io.sockets.emit('messageToClients', msg, userName);

        // logger.warn('-----------'); // Logging
        // logger.warn('User: ' + name + ' | Message: ' + msg);
        // logger.warn('====> Sending message to other chaters...');
        // io.sockets.emit('messageToClients', msg, name); // Отправляем всем сокетам событие 'messageToClients' и отправляем туда же два аргумента (текст, имя юзера)
    });

    socket.on('userAuthInfo', function (authInfoArray) {

        // authInfoArray[0] - ФИО
        // authInfoArray[1] - Ник

        io.sockets.emit('userAuthInfo', authInfoArray);

    });

    socket.on('newUser', function(userName){
        console.log(userName[0] + ' ' + userName[1]);
        socket.emit('newUser', userName);
    });

    // socket.broadcast.emit('newUser', name);
    // logger.info(name + ' connected to chat!');
    // Обработчик ниже // Мы его сделали внутри коннекта

});

server.listen(port, function () {
    console.log('listening on *:' + port);
});