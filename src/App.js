import './App.css';
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MainPage from './pages/MainPage'
import NotFoundPage from './pages/NotFoundPage'
import TestPage from './pages/TestPage'



function App() {
  return (
   <div>
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
        <MainPage />
        </Route>

        <Route path='/Test'>
        <TestPage />
        </Route>

        <Route>
        <NotFoundPage/>
        </Route>
      </Switch>
      
    </BrowserRouter>
  </div>
  );
}

export default App;
