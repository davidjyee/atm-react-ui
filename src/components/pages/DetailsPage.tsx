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
  Assignment as AssignmentIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Class as ClassIcon,
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
          <Typography variant="h4" color="secondary">
            {account.name}
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ClassIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Account Type" secondary={account.type} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AssignmentIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Account Number" secondary={account.id} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SupervisorAccountIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Owner State ID" secondary={account.owner} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccountBalanceIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Balance" secondary={`$${account.balance}`} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
}
