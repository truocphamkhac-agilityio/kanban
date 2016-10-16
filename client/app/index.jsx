import './main.css';

import React from 'react';
import ReactDOM from 'react-dom';

// import alt from './libs/alt';
// import storage from './libs/storage';
// import jsonServer from 'json-server';
// import persist from './libs/persist';

import App from './components/App.jsx';

// persist(alt, jsonServer, 'app');

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
