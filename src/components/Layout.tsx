import React, { ChangeEvent } from 'react';

import { IStoreState, ThunkDispatch } from '../store';
import { useSelector, useDispatch } from 'react-redux';

import * as logo from '../../assets/fleeca-logo.png';

import {
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
  SelectProps,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Navigation from './Navigation';

import { showUI, swapAccount } from '../actions';

interface SelectAccountProps {
  className: string;
}

function SelectAccount(props: SelectAccountProps) {
  const dispatch = useDispatch();

  const account = useSelector((state: IStoreState) => state.account);
  const accounts = useSelector((state: IStoreState) => state.data.accounts);
  const status = useSelector((state: IStoreState) => state.status);

  return (
    <div className={props.className}>
      <Grid container direction="row" spacing={1} alignItems="center">
        <Grid item>
          <FormControl variant="standard">
            <InputLabel id="account-select-label">Account</InputLabel>
            <Select
              labelId="account-select-label"
              id="account-select"
              value={account.id}
              onChange={(event: ChangeEvent<SelectProps>) =>
                dispatch(swapAccount(event.target.value as number))
              }
            >
              {accounts.map((account) => {
                return (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} - {account.id}
                  </MenuItem>
                );
              })}
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
    marginLeft: theme.spacing(2),
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
  image: {
    height: '50px',
  },
}));

export default function Layout(props: LayoutProps): JSX.Element {
  const classes = useStyles();
  const dispatch: ThunkDispatch = useDispatch();
  const show = useSelector((state: IStoreState) => state.interface.show);
  const type = useSelector((state: IStoreState) => state.interface.type);

  return (
    <Fade in={show} timeout={400}>
      <div className={classes.root}>
        <AppBar position="relative">
          <Toolbar variant="dense">
            {type === 'fleeca-teller' && (
              <img className={classes.image} src={logo} alt="Fleeca Bank Teller" />
            )}
            {type === 'fleeca-atm' && (
              <img className={classes.image} src={logo} alt="Fleeca Bank ATM" />
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
  );
}
