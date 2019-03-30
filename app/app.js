$(function () {
    var port = 3000; // Указываем порт на котором у на стоит сокет
    var socket = io.connect('http://localhost:' + port);

    $('#authForm').submit(function (e) {
        e.preventDefault();
        // Авторизация пользователя
        
        var fullName = $('#fullName').val(); // Все что в поле для ввода записываем в переменную
        var nickName = $('#nickName').val(); // Все что в поле для ввода записываем в переменную
        // Прослушка кнопки на клик
        if(fullName && nickName) {
            console.log('заполнено!!');
            socket.emit('userAuthInfo', [fullName, nickName]); // Отправляем событие 'message' на сервер c самим текстом (message)- как переменная
            $('.user-auth').hide();
        }
        else {
            alert('Заполните оба поля!');
        }
        // socket.emit('message', message); // Отправляем событие 'message' на сервер c самим текстом (message)- как переменная
        // $('#messageInput').val(null); // Заполняем поле для ввода 'пустотой'
    });

    $('#chatForm').submit(function (e) {
        e.preventDefault(); // prevents page reloading

        // Прослушка кнопки на клик
        var message = $('#messageInput').val(); // Все что в поле для ввода записываем в переменную
        var userName = $('.user-name').text();
        
        socket.emit('chat message', message, userName); // Отправляем событие 'message' на сервер c самим текстом (message)- как переменная
        $('#messageInput').val(null); // Заполняем поле для ввода 'пустотой'
    });

    socket.on('chat message', function (msg, userName) {
        $('#messages').append($('<li>').text(userName + ': ' + msg));
    });

    socket.on('userAuthInfo', function (userName) { 
        // Авторизация

        socket.emit('newUser', userName);

        console.log('You\'r username is => ' + userName[0]); // Логгирование в консоль браузера
        $('#chatInfo').val($('#chatInfo').val() + 'You\'r username => ' + userName +
            '\n');
        $('#usersList').append($('<li>').text(userName));
        $('.user-name').text(userName);

    });

    socket.on('messageToClients', function (msg, name) {
        // console.log(name + ' | => ' + msg); // Логгирование в консоль браузера
        $('#chatInfo').val($('#chatInfo').val() + name + ' : ' + msg + '\n'); // Добавляем в поле для текста сообщение типа (Ник : текст)
    });
});