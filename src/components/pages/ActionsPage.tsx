import React, { ChangeEvent } from 'react';

import { ThunkDispatch, IStoreState, ThunkResult } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deposit, withdraw, setParameter } from '../../actions';

import { UserId, AccountId } from '../../types';

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
  fieldId: string;
  fieldText: string;

  buttonText: string;
  buttonAction: (
    by: UserId,
    amount: number,
    account: AccountId
  ) => ThunkResult<Promise<void>>;

  toAccount: boolean;
}

function ActionCash(props: cashProps) {
  const classes = useStyles();

  const dispatch = useDispatch();

  // Retrieve data about user and account
  const account = useSelector((state: IStoreState) => state.account);
  const status = useSelector((state: IStoreState) => state.status);

  // Retrieve data about current field being used
  const fieldValue = useSelector((state: IStoreState) => state.pageData[props.fieldId]);
  const fieldCheck = validAmount(
    fieldValue,
    props.toAccount ? status.cash : account.balance
  );

  const balanceText = getBalanceText(account.balance, props.toAccount, fieldCheck.amount);
  const cashText = getBalanceText(status.cash, !props.toAccount, fieldCheck.amount);

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <List className={classes.list}>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Account Balance" secondary={balanceText} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceWalletIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Cash" secondary={cashText} />
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
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setParameter(props.fieldId, event.target.value))
          }
          error={fieldCheck.error && Boolean(fieldValue)}
          helperText={Boolean(fieldValue) && fieldCheck.message}
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button
          onClick={() => dispatch(props.buttonAction(status.id, fieldValue, account.id))}
          variant="contained"
          color="primary"
          disabled={fieldCheck.error || !fieldValue}
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
  const numberRegex = /^\d+(\.\d+)?$/;

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

export default function ActionsPage(): JSX.Element {
  const dispatch: ThunkDispatch = useDispatch();

  // Handle accordion expansion so only one action is visible at a time
  const actionExpanded = useSelector(
    (state: IStoreState) => state.pageData['actionExpanded']
  );
  const handleChange =
    (panel: string) => (event: React.ChangeEvent<unknown>, isExpanded: boolean) => {
      dispatch(setParameter('actionExpanded', isExpanded ? panel : null));
    };

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
            buttonText="Deposit"
            buttonAction={deposit}
            fieldId="deposit-field"
            toAccount={true}
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
            buttonText="Withdraw"
            buttonAction={withdraw}
            fieldId="withdraw-field"
            toAccount={false}
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
