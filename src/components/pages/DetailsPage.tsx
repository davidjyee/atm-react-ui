import React from 'react';

import { IStoreState } from '../../store';
import { useSelector } from 'react-redux';

import {
  Card,
  CardContent,
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  AccountBalance as AccountBalanceIcon,
  AccountBox as AccountBoxIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
  })
);

export default function DetailsPage() {
  const account = useSelector((state: IStoreState) => state.account);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h4" color="textPrimary">
            {account.name}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <AccountBoxIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Account Number" secondary={account.number} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccountBalanceIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Account Balance" secondary={`$${account.balance}`} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
}
