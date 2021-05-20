import React from 'react';

import { Tabs, Tab } from '@material-ui/core';

import { useLocation, useHistory } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const history = useHistory();

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={location.pathname}
      onChange={(event: React.ChangeEvent<{}>, newValue: string) => {
        console.log(newValue);
        history.push(newValue);
      }}
    >
      <Tab label="Actions" value="/actions" />
      <Tab label="Accounts" value="/accounts" />
    </Tabs>
  );
}
