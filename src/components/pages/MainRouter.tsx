import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ActionsPage from './ActionsPage';
import DetailsPage from './DetailsPage';

export default function MainRouter() {
  return (
    <Switch>
      <Route path="/actions">
        <ActionsPage />
      </Route>
      <Route path="/details">
        <DetailsPage />
      </Route>
      <Route path="/manage">Test</Route>
      <Route path="/transactions">Test</Route>
      <Route path="/">
        <Redirect to="/actions" />
      </Route>
    </Switch>
  );
}
