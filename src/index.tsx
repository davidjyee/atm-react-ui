import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

import store from './store';
import { Provider } from 'react-redux';

//Register the event listeners by running the file
import './registerEventListeners';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
