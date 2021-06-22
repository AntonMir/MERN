import React, {useState, useEffect, useContext} from 'react';
// castom hook
import {useHttp} from '../../hooks/http.hook.js'
import {useMessage} from '../../hooks/message.hook.js'
// context
import {AuthContext} from '@src/context/AuthContext.js'
// style
import './authPage.scss'


function AuthPage() {
    // используем контекст кторый создали (AuthContext)
    // это нужно, чтобы воспользоваться методом login
    const auth = useContext(AuthContext)

    // кастомный хук для вывоа ошибки
    const message = useMessage();

    // кастомный хук для отправки данных
    const {loading, error, request, clearError} = useHttp();

    // state для email и pass
    const [form, setForm] = useState({email: '', password: ''});

    // обработаем ошибку
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError]);

    // сохраняем в наш state email и password
    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    // вызывает хук useHttp, отправляет запрос на сервер,
    // получает ответ в виде промиса и выводит его на экран
    // A) при регистрации
    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch(e) {}
    }
    // B) при авторизации
    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch(e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h2>Сократи ссылку</h2>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>

                            <div className="input-field">
                                <input 
                                    placeholder="" 
                                    id="email" 
                                    type="text"
                                    name="email" 
                                    className="yellow-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="first_name">Email</label>
                            </div>

                            <div className="input-field">
                                <input 
                                    placeholder="" 
                                    id="password" 
                                    type="password" 
                                    name="password" 
                                    className="yellow-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="first_name">Password</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                            className="btn yellow darken-4" 
                            style={{marginRight: 10}}
                            onClick={loginHandler}
                            disabled={loading}
                        >Войти</button>

                        <button 
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage;