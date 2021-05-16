// роуты в Express
// ВИДЫ: GET POST PATCH DELETE PUT ...

// берем роутер из express
const {Router, response} = require('express');
// подключаем bcript - библиотека для шифрования и сравнения паролей
const bcript = require('bcryptjs');
// библиотека валидации данных, будем использовать при проверке email и password
const {check, validationResult} = require('express-validator');
// создаем константу роутер
const router = Router();
// схема пользователя из modules
// модели обычно называют с большой буквы
const User = require('../modeles/User.js');

// создаем роут POST для /api/auth из app.js
// /api/auth - уже имеющийся префикс
// то, что мы добавим в запрос уже будет конкатенироваться с префиксом
// получится: /api/auth/register
// 3(ранее был 2) параметр идет функция, которая выполняется в случае перехода по /api/auth/register
// добавляем 2 параметр - валидация email через express-validator
router.post(
    '/register',
    [
        // 2 параметр для валидация email через express-validator
        check('mail', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({ min: 6 })
    ],
    async (request, response) => {

    try {
        // таким способом валидатор проверяет входящие поля
        const errors = validationResult(request);
        
        // добавляем проверку если erros не пустой (значит, что есть ошибки)
        if (!errors.isEmpty()) {
            return response.status(400).json({
                // в виде массива (array) передаем на фронт ответ
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        // деструктуризацией получаем с фронта присланные Почту и Пароль
        const {email, password} = request.body;
        
        // проверяем, есть ли такой пользователь уже в базе
        // проверка методом omngodb (findOne - найти первый попавшийся)
        const candidate = await User.findOne({ email: email });
        // если найдено совпадение, то:
        if (candidate) {
            return response.status(400).json({ message: 'Пользователь с такие email уже существует.'})
        };

        // передаем пароль в метод зашифровки bcript.hash() (он асинхронный)
        // 12 - доп. значение для еще большей зашифровки
        const hashedPassword = await bcript.hash(password, 12);
        
        // после проверок и зашифровки пароля создаем нового пользователя
        // передаем  email и зашифрованный пароль
        const user = new User({ email: email, password: hashedPassword });

        // ждем пока пользователь сохранится
        // когда данный Promise() будет завершен, мы можем вернуть сообщение
        await user.save();

        // после сохранения нового пользователя отвечаем на фронт
        return response.status(201).json({ message: "Регистрация успешно завершена."})

    } catch (error) {
        response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова.'});
        console.log('---', `<register> error - ${error}`);
    }
});

// выполнится при переходе по /api/auth/login
router.post('/login', async (request, response) => {

});

// экспортируем из этого файла объект router;
module.exports = router;