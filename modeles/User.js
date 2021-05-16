// Модель пользователя
// для создания можели берем из moongose схему и модель
const {Schema, model, Types} = require('mongoose');

// создаем упрощенную базовую схему с полями базы
const schema = new Schema({
    //поле: {тип данных, обязательность, уникальность}
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},

    // уникальные ссылки для каждого пользователя
    // ссылки являются определенным типом данных, импортируем этот тип из mongoose
    // поле: [{ тип, пояснение(к какой коллекции мы привязываемся)}]
    links: [{ type: Types.ObjectId, ref: 'Link' }]
});

// экспортируем модель User и схему по которой он работает (schema)
module.exports = model('User', schema);
