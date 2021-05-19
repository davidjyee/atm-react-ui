import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

//Register the event listeners by running the file
import './registerEventListeners';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
