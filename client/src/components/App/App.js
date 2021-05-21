import React from 'react'
// routes
import {BrowserRouter as Router} from 'react-router-dom';
// components
import {useRoutes} from '@components/routes/Routes.js'
// styles
import './app.scss';
import 'materialize-css';


function App() {

    const routes = useRoutes(false);

    return (
        <>
            <Router>
                {/* className="container" - из materialize-css ширина 1280px и отцентровка */}
                <section className="container">
                    {routes}
                </section>
            </Router>
        </>
    );
}

export default App;
