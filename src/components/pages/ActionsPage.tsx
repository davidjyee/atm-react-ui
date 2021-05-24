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

  balance: number;
  cash: number;
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
            <ListItemText primary="Account Balance" secondary={`$${props.balance}`} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountBalanceWalletIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Cash" secondary={`$${props.cash}`} />
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
        />
      </Grid>
      <Divider />
      <Grid item>
        <Button onClick={props.onButtonClick} variant="contained" color="primary">
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
          onClick={() => dispatch(deposit(50)).then(console.log)}
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

  const depositFieldId = 'deposit-field';
  const depositFieldValue = useSelector(
    (state: IStoreState) => state.pageData[depositFieldId]
  );

  const withdrawFieldId = 'withdraw-field';
  const withdrawFieldValue = useSelector(
    (state: IStoreState) => state.pageData[withdrawFieldId]
  );

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
              dispatch(setParameter(depositFieldId, parseInt(event.target.value)))
            }
            balance={account.balance}
            cash={status.cash}
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
              dispatch(setParameter(withdrawFieldId, parseInt(event.target.value)))
            }
            balance={account.balance}
            cash={status.cash}
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
