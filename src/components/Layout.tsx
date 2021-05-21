import React, { MouseEvent } from 'react';

import { IStoreState, ThunkDispatch } from '../store';
import { useSelector, useDispatch } from 'react-redux';

import {
  ClickAwayListener,
  Fade,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Navigation from './Navigation';

import { showUI } from '../actions';

interface SelectAccountProps {
  className: string;
}

function SelectAccount(props: SelectAccountProps) {
  const account = useSelector((state: IStoreState) => state.account);
  const status = useSelector((state: IStoreState) => state.status);

  return (
    <div className={props.className}>
      <Grid container direction="row" spacing={1} alignItems="center">
        <Grid item>
          <FormControl variant="standard">
            <InputLabel id="demo-simple-select-filled-label">Account</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={account.number}
              onChange={() => {}}
            >
              <MenuItem value={account.number}>
                {account.name} - {account.number}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={0}>
            <Grid item>
              <Typography variant="caption" display="inline">
                State ID: {status.id}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" display="inline">
                Name: {status.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="caption" display="inline">
                Cash: ${status.cash}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

interface LayoutProps {
  children: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    margin: '15%',
    border: `1px solid ${theme.palette.divider}`,
  },
  title: {
    marginRight: theme.spacing(2),
  },
  accountSelect: {
    flexGrow: 1,
  },
  navigation: {
    borderRight: `1px solid ${theme.palette.divider}`,
    margin: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    margin: theme.spacing(1),
  },
}));

export default function Layout(props: LayoutProps) {
  const classes = useStyles();
  const dispatch: ThunkDispatch = useDispatch();
  const show = useSelector((state: IStoreState) => state.messages.show);

  return (
    <ClickAwayListener
      onClickAway={(event: MouseEvent<Document>) => {
        console.log(event.button);
        if (event.button === 2) {
          dispatch(showUI(false));
        }
      }}
    >
      <Fade in={show} timeout={400}>
        <div className={classes.root}>
          <AppBar position="relative">
            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.title} noWrap>
                Automated Telling Machine
              </Typography>
              <SelectAccount className={classes.accountSelect} />
              <Button onClick={() => dispatch(showUI(false))} color="inherit">
                Exit
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container spacing={1}>
            <Grid item className={classes.navigation}>
              <Navigation />
            </Grid>
            <Grid item className={classes.content}>
              {props.children}
            </Grid>
          </Grid>
        </div>
      </Fade>
    </ClickAwayListener>
  );
}
