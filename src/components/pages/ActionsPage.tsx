import React, { MouseEventHandler, ChangeEventHandler, ChangeEvent } from 'react';

import { ThunkDispatch, IStoreState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deposit, withdraw, setParameter } from '../../actions';

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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ExpandMore as ExpandMoreIcon,
  AccountBalance as AccountBalanceIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    headingDeposit: {
      color: theme.palette.success.main,
    },
    headingWithdraw: {
      color: theme.palette.error.main,
    },
    headingTransfer: {
      color: theme.palette.secondary.main,
    },
    list: {
      borderLeft: `2px solid ${theme.palette.divider}`,
    },
  })
);

interface cashProps {
  fieldText: string;
  fieldValue: string;
  buttonText: string;

  onFieldChange: ChangeEventHandler;
  onButtonClick: MouseEventHandler;

  balanceText: string;
  cashText: string;

  error: boolean;
}

function ActionCash(props: cashProps) {
  const classes = useStyles();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <List className={classes.list}>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Account Balance" secondary={props.balanceText} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceWalletIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Cash" secondary={props.cashText} />
          </ListItem>
        </List>
      </Grid>
      <Grid item>
        <TextField
          label={props.fieldText}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          variant="filled"
          onChange={props.onFieldChange}
          error={props.error}
          helperText={props.error ? 'Must be a positive number' : ''}
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button
          onClick={props.onButtonClick}
          variant="contained"
          color="primary"
          disabled={props.error || !props.fieldValue}
        >
          {props.buttonText}
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
        <Button
          onClick={() => dispatch(deposit(0, 50, 0)).then(console.log)}
          variant="contained"
          color="primary"
        >
          Transfer
        </Button>
      </Grid>
    </Grid>
  );
}

export default function ActionsPage() {
  const dispatch: ThunkDispatch = useDispatch();

  const account = useSelector((state: IStoreState) => state.account);
  const status = useSelector((state: IStoreState) => state.status);

  const numberRegex: RegExp = /^\d+(\.\d+)?$/;

  const depositFieldId = 'deposit-field';
  const depositFieldValue = useSelector(
    (state: IStoreState) => state.pageData[depositFieldId]
  );
  const depositValid: boolean =
    depositFieldValue &&
    numberRegex.test(depositFieldValue) &&
    parseFloat(depositFieldValue) >= 0.01 &&
    parseFloat(depositFieldValue) <= status.cash;
  const depositValue: number = depositValid ? parseFloat(depositFieldValue) : 0;

  const withdrawFieldId = 'withdraw-field';
  const withdrawFieldValue = useSelector(
    (state: IStoreState) => state.pageData[withdrawFieldId]
  );
  const withdrawValid: boolean =
    withdrawFieldValue &&
    numberRegex.test(withdrawFieldValue) &&
    parseFloat(withdrawFieldValue) >= 0.01 &&
    parseFloat(withdrawFieldValue) <= account.balance;
  const withdrawValue: number = withdrawValid ? parseFloat(withdrawFieldValue) : 0;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingDeposit} variant="h4">
            Deposit
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActionCash
            fieldText="Amount to Deposit"
            fieldValue={depositFieldValue}
            buttonText="Deposit"
            onButtonClick={() =>
              dispatch(deposit(status.id, depositFieldValue, account.id))
            }
            onFieldChange={(event: ChangeEvent<HTMLInputElement>) =>
              dispatch(setParameter(depositFieldId, event.target.value))
            }
            balanceText={`$${account.balance} + $${depositValue} = $${
              account.balance + depositValue
            }`}
            cashText={`$${status.cash} - $${depositValue} = $${
              status.cash - depositValue
            }`}
            error={Boolean(depositFieldValue) && !depositValid}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingWithdraw} variant="h4">
            Withdraw
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActionCash
            fieldText="Amount to Withdraw"
            fieldValue={withdrawFieldValue}
            buttonText="Withdraw"
            onButtonClick={() =>
              dispatch(withdraw(status.id, withdrawFieldValue, account.id))
            }
            onFieldChange={(event: ChangeEvent<HTMLInputElement>) =>
              dispatch(setParameter(withdrawFieldId, event.target.value))
            }
            balanceText={`$${account.balance} - $${withdrawValue} = $${
              account.balance - withdrawValue
            }`}
            cashText={`$${status.cash} + $${withdrawValue} = $${
              status.cash + withdrawValue
            }`}
            error={Boolean(withdrawFieldValue) && !withdrawValid}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.headingTransfer} variant="h4">
            Transfer
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActionTransfer />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
