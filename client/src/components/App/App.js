import React from 'react'
// routes
import {BrowserRouter as Router} from 'react-router-dom';
// components
import {useRoutes} from '@components/routes/Routes.js'
import { Navbar } from '@components/navBar/NavBar.js';
// hooks
import {useAuth} from '@src/hooks/auth.hook.js'
// context
import {AuthContext} from '@src/context/AuthContext.js'
// styles
import './app.scss';
import 'materialize-css';


function App() {

    // берем из хука аутентификации
    const {login, logout, token, userId} = useAuth();

    // флаг, который показывает, есть ли токен(вошел ли пользователь)
    const isAuthenticated = !!token;

    // это не хук, возвращает определенные роуты, если пользователь авторизован/не авторизован
    const routes = useRoutes(isAuthenticated);

    return (
        // AuthContext - является контекстом, но он должен быть обязательно провайдером
        <AuthContext.Provider 
            // передаем в наш контекст матоды и переменные из хука аутентификации
            value={{token, userId, login, logout, isAuthenticated}}
        >
            <Router>
                { isAuthenticated && <Navbar /> }
                {/* className="container" - из materialize-css ширина 1280px и отцентровка */}
                <section className="container">
                    {routes}
                </section>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
