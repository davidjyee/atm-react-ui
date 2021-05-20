import React from 'react';

import { Tabs, Tab } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function Navigation() {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  return (
    <div className={classes.tabs}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={location.pathname}
        onChange={(event: React.ChangeEvent<{}>, newValue: number) => {
          console.log(newValue);
          history.push(newValue);
        }}
      >
        <Tab label="Actions" value="/actions" />
        <Tab label="Accounts" value="/accounts" />
      </Tabs>
    </div>
  );
}
