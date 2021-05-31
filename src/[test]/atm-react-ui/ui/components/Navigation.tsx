import React from 'react';

import { Tabs, Tab } from '@material-ui/core';

import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IStoreState } from '../store';

export default function Navigation(): JSX.Element {
  const location = useLocation();
  const history = useHistory();

  const allowedTabs = useSelector((state: IStoreState) => state.interface.allowedTabs);

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={location.pathname}
      onChange={(event: React.ChangeEvent<unknown>, newValue: string) => {
        history.push(newValue);
      }}
    >
      <Tab disabled={!allowedTabs.includes('actions')} label="Actions" value="/actions" />
      <Tab
        disabled={!allowedTabs.includes('details')}
        label="Account Details"
        value="/details"
      />
      <Tab
        disabled={!allowedTabs.includes('manage')}
        label="Manage Access"
        value="/manage"
      />
      <Tab
        disabled={!allowedTabs.includes('transactions')}
        label="Transaction Log"
        value="/transactions"
      />
    </Tabs>
  );
}
