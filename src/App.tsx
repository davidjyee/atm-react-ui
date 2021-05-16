import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data.type === 'atm-visibility') {
        setShowUI(event.data.visibility);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">{showUI && <h1> This is a test </h1>}</header>
    </div>
  );
}

export default App;
