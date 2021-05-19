import React, { useEffect, useState } from 'react';
import './App.scss';

import store from './store';
import { Provider } from 'react-redux';

function App() {
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'atm-visibility') {
        setShowUI(event.data.visibility);

        fetch(`https://atm-esx-react-example/focus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            focus: event.data.visbility,
          }),
        });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          {showUI && (
            <div>
              <button
                className="mdc-button mdc-button--raised"
                onClick={() => {
                  fetch(`https://atm-esx-react-example/deposit`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                      amount: 50,
                    }),
                  })
                    .then((res) => res.json())
                    .then((res) => console.log(JSON.stringify(res)));
                }}
              >
                <span className="mdc-button__label"> Deposit </span>
              </button>
              <button
                className="mdc-button mdc-button--raised"
                onClick={() => {
                  setShowUI(false);

                  fetch(`https://atm-esx-react-example/focus`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                      focus: false,
                    }),
                  });
                }}
              >
                <span className="mdc-button__label"> Exit </span>
              </button>
            </div>
          )}
        </header>
      </div>
    </Provider>
  );
}

export default App;
