import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ActionsPage from './ActionsPage';
import DetailsPage from './DetailsPage';
import ManagementPage from './ManagementPage';
import TransactionsPage from './TransactionsPage';

export default function MainRouter(): JSX.Element {
  return (
    <Switch>
      <Route path="/actions">
        <ActionsPage />
      </Route>
      <Route path="/details">
        <DetailsPage />
      </Route>
      <Route path="/manage">
        <ManagementPage />
      </Route>
      <Route path="/transactions">
        <TransactionsPage />
      </Route>
      <Route path="/">
        <Redirect to="/actions" />
      </Route>
    </Switch>
  );
}
