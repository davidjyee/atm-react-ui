import React from 'react';

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
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Navigation from './Navigation';

import { showUI } from '../actions';

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
    <ClickAwayListener onClickAway={() => dispatch(showUI(false))}>
      <Fade in={show} timeout={400}>
        <div className={classes.root}>
          <AppBar position="relative">
            <Toolbar variant="dense">
              <Typography variant="h6" className={classes.title} noWrap>
                Automated Telling Machine
              </Typography>
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
