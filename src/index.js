import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './Master/MainLayout';
import './Asset/scss/App.scss'
import LoginLayout from './Master/LoginLayout';

ReactDOM.render(
  <React.StrictMode>
    <LoginLayout />
  </React.StrictMode>,
  document.getElementById('root')
);