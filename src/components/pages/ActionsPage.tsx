import React from 'react';

import { ThunkDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { deposit } from '../../actions';

import {
  Grid,
  Button,
  InputAdornment,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Typography,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

function ActionDeposit() {
  const dispatch: ThunkDispatch = useDispatch();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <TextField
          label="Amount to Deposit"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          variant="filled"
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button onClick={() => dispatch(deposit(50)).then(console.log)} variant="contained" color="primary">
          Deposit
        </Button>
      </Grid>
    </Grid>
  );
}

function ActionWithdraw() {
  const dispatch: ThunkDispatch = useDispatch();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <TextField
          label="Amount to Withdraw"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          variant="filled"
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button onClick={() => dispatch(deposit(50)).then(console.log)} variant="contained" color="primary">
          Withdraw
        </Button>
      </Grid>
    </Grid>
  );
}

function ActionTransfer() {
  const dispatch: ThunkDispatch = useDispatch();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <TextField
          label="Amount to Transfer"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          variant="filled"
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button onClick={() => dispatch(deposit(50)).then(console.log)} variant="contained" color="primary">
          Transfer
        </Button>
      </Grid>
    </Grid>
  );
}

export default function ActionsPage() {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Deposit</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActionDeposit />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Withdraw</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActionWithdraw />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>Wire Transfer</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActionTransfer />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
