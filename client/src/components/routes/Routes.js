import React from 'react'
// routes
import { Switch, Route, Redirect } from 'react-router-dom'
// components
import AuthPage from '@components/authPage/AuthPage.js';
import CreatePage from '@components/createPage/CreatePage.js';
import DetailPage from '@components/detailPage/DetailPage.js';
import LinksPage from '@components/linksPage/LinksPage.js';



export function useRoutes(isAuthenticated) {
    
    if(isAuthenticated) {
        // это для человека, который зашел в систему
        return (
            <Switch>
                <Route exact path="/links" component={LinksPage}/>
                <Route exact path="/create" component={CreatePage}/>
                <Route path="/detail/:id" component={DetailPage}/>
                <Redirect to="/create"/>
            </Switch>
        )
    }

    return (
        <Switch>
                <Route exact path="/" component={AuthPage}/>
                <Redirect to="/"/>
        </Switch>
    )
}