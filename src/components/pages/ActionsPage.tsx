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

  check: AmountCheck;
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
          error={props.check.error && Boolean(props.fieldValue)}
          helperText={Boolean(props.fieldValue) && props.check.message}
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button
          onClick={props.onButtonClick}
          variant="contained"
          color="primary"
          disabled={props.check.error || !props.fieldValue}
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

interface AmountCheck {
  error: boolean;
  amount?: number;
  message?: string;
}

function validAmount(amount: string, limit?: number): AmountCheck {
  const numberRegex: RegExp = /^\d+(\.\d+)?$/;

  const isNumber: boolean = Boolean(amount) && numberRegex.test(amount);

  if (!isNumber) {
    return {
      error: true,
      message: 'Must be a positive number',
    };
  }

  const parsedNumber: number = parseFloat(amount);

  const isPositive: boolean = parsedNumber > 0;
  const isBigEnough: boolean = parsedNumber >= 0.01;
  const isSmallerThanLimit: boolean = !limit || parsedNumber <= limit;

  if (!isPositive) {
    return {
      error: true,
      message: 'Must be a postive number',
    };
  } else if (!isBigEnough) {
    return {
      error: true,
      message: 'Must be larger than one cent',
    };
  } else if (!isSmallerThanLimit) {
    return {
      error: true,
      message: 'Must have the requested amount',
    };
  } else {
    return {
      error: false,
      amount: parsedNumber,
    };
  }
}

function getBalanceText(balance: number, addition: boolean, amount?: number): string {
  if (!amount) {
    return `$${balance}`;
  } else if (addition) {
    return `$${balance} + $${amount} = $${balance + amount}`;
  } else {
    return `$${balance} - $${amount} = $${balance - amount}`;
  }
}

export default function ActionsPage() {
  const dispatch: ThunkDispatch = useDispatch();

  const actionExpanded = useSelector(
    (state: IStoreState) => state.pageData['actionExpanded']
  );
  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      dispatch(setParameter('actionExpanded', isExpanded ? panel : null));
    };

  const account = useSelector((state: IStoreState) => state.account);
  const status = useSelector((state: IStoreState) => state.status);

  const depositFieldId = 'deposit-field';
  const depositFieldValue = useSelector(
    (state: IStoreState) => state.pageData[depositFieldId]
  );
  const depositCheck = validAmount(depositFieldValue, status.cash);

  const withdrawFieldId = 'withdraw-field';
  const withdrawFieldValue = useSelector(
    (state: IStoreState) => state.pageData[withdrawFieldId]
  );
  const withdrawCheck = validAmount(withdrawFieldValue, account.balance);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion
        expanded={actionExpanded === 'deposit'}
        onChange={handleChange('deposit')}
      >
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
            balanceText={getBalanceText(account.balance, true, depositCheck.amount)}
            cashText={getBalanceText(status.cash, false, depositCheck.amount)}
            check={depositCheck}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={actionExpanded === 'withdraw'}
        onChange={handleChange('withdraw')}
      >
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
            balanceText={getBalanceText(account.balance, false, withdrawCheck.amount)}
            cashText={getBalanceText(status.cash, true, withdrawCheck.amount)}
            check={withdrawCheck}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={actionExpanded === 'transfer'}
        onChange={handleChange('transfer')}
      >
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
