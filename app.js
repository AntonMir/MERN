/*
* 1. - первоначальная настройка базового сервера
* 2. - манипуляция с базой данных MongoDB
* 3. - работа с роутами и front-end (api)
*/

// 1.подключаем Express
const express = require('express');
// 1.конфигурация из default.json
const config = require('config');
// 2.подключаем mongoose: коннект к базе MongoDB
const mongoose = require('mongoose');
// 3. подключаем роуты из auth.ruters.js
const routers = require('./routes/auth.routes.js');

// 1.результат работы функции express - наш будущий сервер
const app = express();

app.use(express.json({ extended: true}))

// 3. тут будет аутентификация
app.use('/api/auth', routers);

// 1.запихиваем в константу port, прописанный в default.json 
// или если оне не определен, то пусть по умолчанию будет 5000
const PORT = config.get('port') || 5000;

// 2.вызываем метод conneсt, который позволит подключиться к базе данных
// т.к. метод connect мне возвращает Promise(), оборачиваем в функцию asinc/await
// обертка, чтобы пользоваться синтаксисом asinc/await
async function start() {
    try {
        // передаем URL и набор опций для коннекта к базе
        await mongoose.connect(config.get('mongoUri'), {
            // тут набор параметров, чтоб наш коннект успешно работал
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        // 2. После коннекта к MongoDB
        // 1. Прослушиваем порт 5000, и выполняем функцию во 2 параметре
        app.listen(PORT, () => {
            console.log(`--- Server has been started on port ${PORT}...`);
        });

    } catch (error) {
        // если что-то пошло не так, выводим это в консоль и прерываем процесс.
        console.log('--- Server Error:', error.message, '---');
        process.exit(1);
    }
};

// вызываем асинхронную функцию старта приложения после подключения к базе
start()


// 1.Прослушиваем порт 5000, и выполняем функцию во 2 параметре
// app.listen(PORT, () => {
//     console.log(`Server has been started on port ${PORT}...`);
// });