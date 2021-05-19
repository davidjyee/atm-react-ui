import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ActionsPage from './ActionsPage';

export default function MainRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/actions">
          <ActionsPage />
        </Route>
        <Route path="/">
          <Redirect to="/actions" />
        </Route>
      </Switch>
    </Router>
  );
}
