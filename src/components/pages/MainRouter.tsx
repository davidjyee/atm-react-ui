import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ActionsPage from './ActionsPage';

export default function MainRouter() {
  return (
    <Switch>
      <Route path="/actions">
        <ActionsPage />
      </Route>
      <Route path="/accounts">Test</Route>
      <Route path="/">
        <Redirect to="/actions" />
      </Route>
    </Switch>
  );
}
