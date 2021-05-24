import React, { ChangeEvent } from 'react';

import { ThunkDispatch, IStoreState, ThunkResult } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deposit, withdraw, setParameter, transfer } from '../../actions';

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
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  SelectProps,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ExpandMore as ExpandMoreIcon,
  AccountBalance as AccountBalanceIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  GetApp as GetAppIcon,
  Publish as PublishIcon,
} from '@material-ui/icons';

interface AmountCheck {
  error: boolean;
  amount?: number;
  message?: string;
}

function validAmount(amount: string, limit?: number, minimum?: number): AmountCheck {
  const numberRegex = /^\d+\.?\d*$/;
  const twoDecRegex = /^\d+\.(?!\d{3,})|^\d+$/;

  const isNumber: boolean = Boolean(amount) && numberRegex.test(amount);

  if (!isNumber) {
    return {
      error: true,
      message: 'Must be a positive number',
    };
  }

  const parsedNumber: number = parseFloat(amount);

  const isPositive: boolean = parsedNumber > 0;
  const isBigEnough: boolean = twoDecRegex.test(amount);
  const isSmallerThanLimit: boolean = !limit || parsedNumber <= limit;
  const isBiggerThanLimit: boolean = !minimum || parsedNumber >= minimum;

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
  } else if (!isBiggerThanLimit) {
    return {
      error: true,
      message: 'Must be bigger than the minimum amount',
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
  const fieldValue: string = useSelector(
    (state: IStoreState) => state.pageData[props.fieldId]
  ) as string;
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
          value={fieldValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setParameter(props.fieldId, event.target.value))
          }
          error={Boolean(fieldValue) && fieldCheck.error}
          helperText={Boolean(fieldValue) && fieldCheck.message}
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button
          onClick={() =>
            dispatch(
              props.buttonAction(
                status.id,
                fieldCheck.amount ? fieldCheck.amount : 0,
                account.id
              )
            )
          }
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
  const classes = useStyles();
  const dispatch: ThunkDispatch = useDispatch();

  // Minimum amount to transfer
  const minimum = 1000;

  // Retrieve data about known accounts
  const accounts = useSelector((state: IStoreState) => state.data.accounts);
  const status = useSelector((state: IStoreState) => state.status);

  // Retrieve data about which accounts are origin and destination
  const originId = 'transfer-origin-select';
  const originValue = useSelector(
    (state: IStoreState) => state.pageData[originId]
  ) as string;
  const originAccount = useSelector((state: IStoreState) =>
    state.data.accounts.find(
      (account) => originValue && account.id === parseInt(originValue)
    )
  );

  const destinationSelectId = 'transfer-destination-select';
  const destinationSelectValue = useSelector(
    (state: IStoreState) => state.pageData[destinationSelectId]
  ) as string;
  const destinationAccount = useSelector((state: IStoreState) =>
    state.data.accounts.find(
      (account) =>
        destinationSelectValue && account.id === parseInt(destinationSelectValue)
    )
  );

  // Retrieve data about the text field being used for money amount
  const fieldId = 'transfer-field';
  const fieldValue = useSelector(
    (state: IStoreState) => state.pageData[fieldId]
  ) as string;
  const fieldCheck = validAmount(fieldValue, originAccount?.balance, minimum);

  // Retrieve data about the text field being used for the note
  const noteId = 'transfer-note';
  const noteValue = useSelector((state: IStoreState) => state.pageData[noteId]) as string;

  // Retrieve the origin and destination balances text
  const originText = originAccount
    ? getBalanceText(originAccount.balance, false, fieldCheck.amount)
    : 'N/A';
  const destinationText = destinationAccount
    ? getBalanceText(destinationAccount.balance, true, fieldCheck.amount)
    : 'N/A';

  // Disable button if invalid
  const disableButton = fieldCheck.error || !fieldValue || !originValue;

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <List className={classes.list}>
          <ListItem>
            <ListItemIcon>
              <PublishIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Origin Balance" secondary={originText} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <GetAppIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Destination Balance" secondary={destinationText} />
          </ListItem>
        </List>
      </Grid>
      <Grid item>
        <FormControl variant="filled" fullWidth>
          <InputLabel shrink id="select-origin-account-label">
            Origin Account
          </InputLabel>
          <Select
            labelId="select-origin-account-label"
            id="select-origin-account"
            value={originValue ? originValue : ''}
            displayEmpty
            onChange={(event: ChangeEvent<SelectProps>) =>
              dispatch(setParameter(originId, event.target.value))
            }
          >
            <MenuItem value="" disabled>
              Select origin account for transfer
            </MenuItem>
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
        <FormControl variant="filled" fullWidth>
          <InputLabel shrink id="select-destination-account-label">
            Destination Account
          </InputLabel>
          <Select
            labelId="select-destination-account-label"
            id="select-destination-account"
            value={destinationSelectValue ? destinationSelectValue : ''}
            displayEmpty
            onChange={(event: ChangeEvent<SelectProps>) =>
              dispatch(setParameter(destinationSelectId, event.target.value))
            }
          >
            <MenuItem value="" disabled>
              Select destination account for transfer
            </MenuItem>
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
        <TextField
          label="Amount to Transfer"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          variant="filled"
          value={fieldValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setParameter(fieldId, event.target.value))
          }
          error={Boolean(fieldValue) && fieldCheck.error}
          helperText={Boolean(fieldValue) && fieldCheck.message}
          fullWidth
        />
      </Grid>
      <Grid item>
        <TextField
          label="Note..."
          variant="filled"
          value={noteValue}
          multiline
          fullWidth
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setParameter(noteId, event.target.value))
          }
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button
          onClick={() =>
            dispatch(
              transfer(
                status.id,
                fieldCheck.amount ? fieldCheck.amount : 0,
                parseInt(originValue),
                parseInt(destinationSelectValue),
                noteValue
              )
            ).then(console.log)
          }
          variant="contained"
          color="primary"
          disabled={disableButton}
        >
          Transfer
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="caption" color="textSecondary">
          *Transfers have no maximum, but a minimum of $1000
        </Typography>
      </Grid>
    </Grid>
  );
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

  // Retrieve allowed actions
  const allowedActions = useSelector(
    (state: IStoreState) => state.interface.allowedActions
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion
        expanded={actionExpanded === 'deposit'}
        onChange={handleChange('deposit')}
        disabled={!allowedActions.includes('deposit')}
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
        disabled={!allowedActions.includes('withdraw')}
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
        disabled={!allowedActions.includes('transfer')}
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
