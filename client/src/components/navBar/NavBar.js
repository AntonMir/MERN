import React, {useContext} from 'react';
// Link
import {Link, useHistory} from 'react-router-dom';
// context
import {AuthContext} from '@src/context/AuthContext.js';
// style
import './navBar.scss';


export const Navbar = () => {

    try{
        // const history = useHistory();
        const auth = useContext(AuthContext);

        const logoutHandler = (event) => {
            event.preventDefault();
            auth.logout();
            // history.push('/');
        }

        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Сокращение ссылок</a>
                    <ul id="nav-mobile" className="right">
                        <li><Link to="/create">Создать</Link></li>
                        <li><Link to="/links">Создать</Link></li>
                        <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                    </ul>
                </div>
            </nav>

        )
    } catch(error) {
        console.error('---', 'ERROR!!! - ', error);
    }

}