import React, { useEffect, useState } from 'react';
import './App.scss';

import store, { ThunkDispatch, IStoreState } from './store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { showUI, deposit } from './actions';

function App() {
  const dispatch: ThunkDispatch = useDispatch();
  const show = useSelector((state: IStoreState) => state.messages.show);

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          {show && (
            <div>
              <button
                className="mdc-button mdc-button--raised"
                onClick={() => dispatch(deposit(50)).then(console.log)}
              >
                <span className="mdc-button__label"> Deposit </span>
              </button>
              <button
                className="mdc-button mdc-button--raised"
                onClick={() => dispatch(showUI(false))}
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
