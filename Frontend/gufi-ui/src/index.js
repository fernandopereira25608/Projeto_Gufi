import React from 'react';
import ReactDOM from 'react-dom';
import {  Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';

import './index.css';

// import Home from './home/home/App.js'; //
import Home from './pages/home/App.js';
import TiposEventos from './pages/tiposEventos/TiposEventos.jsx';
import NotFound from './pages/notFound/notFound';
import Login from './pages/login/login.jsx'

import reportWebVitals from './reportWebVitals';
import { parseJwt, usuarioAutenticado } from './services/auth';

const PermissaoAdm = ({ component : Component}) => (
  <Route
    render = { props =>
      usuarioAutenticado() && parseJwt().role === '1'?
      //operador spread
      <Component {...props} /> :
      <Redirect to="/login" />
    }
  />
)

const PermissaoComum = ({ component : Component}) => (
  <Route
    render = { props =>
      usuarioAutenticado() && parseJwt().role !== '1'?
      //operador spread
      <Component {...props} /> :
      <Redirect to="/login" />
    }
  />
)

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} /> {/* Home */}
        <PermissaoAdm path="/tiposEventos" component={TiposEventos} /> {/* TiposEventos*/}
        <Route path="/login" component={Login} />
        <Route path="/notFound" component={NotFound} /> {/* NotFound*/}
        <Redirect to="/notFound" /> {/* Redireciona para notfound caso não encontre nenhuma rota*/}
      </Switch>
    </div>
  </Router>
)

ReactDOM.render(  
  routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
