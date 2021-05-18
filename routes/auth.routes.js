// роуты в Express
// ВИДЫ: GET POST PATCH DELETE PUT ...

// берем роутер из express
const {Router, response} = require('express');
// подключаем bcript - библиотека для шифрования и сравнения паролей
const bcript = require('bcryptjs');
// конфигурация из default.json для получения jwtSecret
const config = require('config');
// JWT (Json Web Token) - библиотека работы с JWT
const jwt = require('jsonwebtoken');
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
        // 2 параметр для валидация email и password через express-validator
        check('mail', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длинна пароля 6 символов').isLength({ min: 6 })
    ],
    async (request, response) => {

    try {
        // таким способом валидатор проверяет входящие поля из 2 параметра (router.post)
        const errors = validationResult(request);
        
        // добавляем проверку если erros не пустой (значит, что есть ошибки)
        if (!errors.isEmpty()) {
            return response.status(400).json({
                // в виде массива (array) передаем на фронт ошибки
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        // деструктуризацией получаем с фронта присланные Почту и Пароль
        const {email, password} = request.body;
        
        // проверяем, есть ли такой пользователь уже в базе
        // проверка методом omngodb (findOne - найти первый попавшийся)
        // candidate теперь является объектом, 
        // который содержит в себе найденный email и password, который ему соответствует
        const candidate = await User.findOne({ email: email });
        // если найдено совпадение, то:
        if (candidate) {
            return response.status(400).json({ message: 'Пользователь с такие email уже существует'})
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
        return response.status(201).json({ message: 'Регистрация успешно завершена'})

    } catch (error) {
        response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'});
        console.log('---', `<register> error - ${error}`);
    }
});

// выполнится при переходе по /api/auth/login
router.post('/login', 
    [
        // 2 параметр для валидация email и password через express-validator
        // normalizeEmail() - нормализация входящего мыла(немного не понял =) )
        check('mail', 'Введите корректный email').normalizeEmail().isEmail(),
        // .exists() - проверяет есть ли пароль вообще, пароль должен существовать
        check('password', 'Введите пароль').exists()
    ],
    async (request, response) => {
    try {
        // таким способом валидатор проверяет входящие поля из 2 параметра (router.post)
        const errors = validationResult(request);

        // добавляем проверку если erros не пустой (значит, что есть ошибки)
        if (!errors.isEmpty()) {
            return response.status(400).json({ 
                // в виде массива (array) передаем на фронт ошибки
                errors: errors.array(), 
                message: 'Некорректные данные при входе в систему'})
        }

        // Деструктуризация логина и пароля
        const {email, password} = request.body;

        // Проверяем по базе, есть ли у нас совпадения
        // user теперь является объектом, 
        // который содержит в себе найденный email и password, который ему соответствует
        const user = await User.findOne({ email: email });

        // Если нет такого email, возвращаем 400
        // Хорошей практикой будет не выводить сообщение о состоянии пользователя, т.к. 
        // это дает определенную информацию потенциальным хаккерам
        // message: 'Пользователь не найден' - лучше избегать
        if (!user) {
            return response.status(400).json({ message: 'Пользователь не найден'});
        };
        
        // проверяем пароль, соответствует ли пароль в базе паролю введенному пользователем
        // т.к. пароли засекречены через bcript, то сравниваем через bcript засекреченные пароли
        // метов compare() позволяет сравнивать засекреченные пароли
        const isMatchPassword = await bcript.compare(password, user.password);

        // Если пароли из базы и введенный пользователем не равны, то вернуть 400
        // Хорошей практикой будет не выводить сообщение о состоянии пароля, т.к. 
        // это дает определенную информацию потенциальным хаккерам
        // message: 'Неверный пароль, попробуйте снова' - лучше избегать
        if (!isMatchPassword) {
            return response.status(400).json({ message: 'Неверный пароль, попробуйте снова'});
        }

        // ДАЛЕЕ АВТОРИЗАЦИЯ ЧЕРЕЗ JWT ТОКЕН!!!!
        
        // формеруем токен
        const token = jwt.sign(
            // 1 параметр - зашифровываем данные, которые будут передаваться
            { userId: user.id },
            // 2 параметр - строка, которая была указана в jwtSecret (default.json)
            config.get('jwtSecret'),
            // 3 параметр - время жизни токена (рекомендовано на 1 час)
            {expiresIn: '1h'}
        )

        // отправляем токен на клиент
        response.status(200).json({ token: token, userId: user.id });
       
    } catch {
        return response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова'})
    }

});

// экспортируем из этого файла объект router;
module.exports = router;