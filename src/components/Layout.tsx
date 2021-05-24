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
              value={account.id}
            >
              <MenuItem value={account.id}>
                {account.name} - {account.id}
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
  children: JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    position: 'absolute',
    top: '15%',
    left: '15%',
    right: '15%',
    bottom: '15%',
    border: `1px solid ${theme.palette.divider}`,
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
  title: {
    marginRight: theme.spacing(2),
  },
  accountSelect: {
    flexGrow: 1,
  },
  grid: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  navigation: {
    borderRight: `1px solid ${theme.palette.divider}`,
    marginRight: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
  },
}));

export default function Layout(props: LayoutProps): JSX.Element {
  const classes = useStyles();
  const dispatch: ThunkDispatch = useDispatch();
  const show = useSelector((state: IStoreState) => state.interface.show);
  const type = useSelector((state: IStoreState) => state.interface.type);

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
              {type === 'fleeca-teller' && (
                <Typography variant="h5" className={classes.title} noWrap>
                  Fleeca Teller
                </Typography>
              )}
              {type === 'fleeca-atm' && (
                <Typography variant="h5" className={classes.title} noWrap>
                  Fleeca ATM
                </Typography>
              )}
              {type === 'atm' && (
                <Typography variant="h5" className={classes.title} noWrap>
                  Third-party ATM
                </Typography>
              )}
              <SelectAccount className={classes.accountSelect} />
              <Button onClick={() => dispatch(showUI(false))} color="inherit">
                Exit
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container spacing={1} className={classes.grid}>
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
