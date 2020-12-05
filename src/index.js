import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './Master/MainLayout';
import './Asset/scss/App.scss'
import AuthLayout from './Master/AuthLayout';

ReactDOM.render(
  <React.StrictMode>
    <AuthLayout />
  </React.StrictMode>,
  document.getElementById('root')
);