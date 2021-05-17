import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [showUI, setShowUI] = useState(false);

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
    <div className="App">
      <header className="App-header">
        {showUI && (
          <div>
            <button
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
              Deposit
            </button>
            <button
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
              Exit
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
