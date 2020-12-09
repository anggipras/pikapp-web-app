import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Asset/scss/App.scss'
import AuthLayout from './Master/AuthLayout';
import ProductLayout from './Master/ProductLayout';
import { createBrowserHistory } from 'history'
import { Router, Route, Switch } from 'react-router-dom'

var hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path = '/login' component = {() => <AuthLayout isLogin = {true}/>} />
      <Route path = '/register' component = {() => <AuthLayout isLogin = {false}/>} />
      <Route path = '/' component = {() => <ProductLayout/>} />
    </Switch>
  </Router>,
  document.getElementById('root')
);