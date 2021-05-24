import React, { ChangeEvent } from 'react';

import { IStoreState } from '../../store';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';

import {
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Publish as PublishIcon,
  GetApp as GetAppIcon,
  AccountBox as AccountBoxIcon,
  Money as MoneyIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import { Transaction as TransactionProps } from '../../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    headingNone: {
      display: 'flex',
      justifyContent: 'center',
    },
    headingDeposit: {
      color: theme.palette.success.main,
    },
    headingWithdraw: {
      color: theme.palette.error.main,
    },
    secondaryHeading: {
      color: theme.palette.text.secondary,
    },
  })
);

function Transaction(props: TransactionProps) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const classes = useStyles();

  const [expanded, setExpanded] = React.useState<boolean>(false);

  return (
    <Accordion
      className={classes.root}
      expanded={expanded}
      onChange={(event: ChangeEvent<unknown>, isExpanded: boolean) =>
        setExpanded(isExpanded)
      }
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container direction="column">
          <Grid item>
            <Typography
              className={
                props.amount >= 0 ? classes.headingDeposit : classes.headingWithdraw
              }
              variant="h5"
            >
              {props.type.toUpperCase()}
            </Typography>
          </Grid>
          {!expanded && (
            <React.Fragment>
              <Grid item>
                <Typography className={classes.secondaryHeading} variant="caption">
                  {props.time.toLocaleString(DateTime.DATETIME_SHORT)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.secondaryHeading} variant="caption">
                  {currencyFormatter.format(props.amount)}
                </Typography>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </AccordionSummary>
      {expanded && <Divider />}
      <AccordionDetails>
        <List>
          {props.origin && (
            <ListItem>
              <ListItemIcon>
                <PublishIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Origin" secondary={props.origin} />
            </ListItem>
          )}
          {props.destination && (
            <ListItem>
              <ListItemIcon>
                <GetAppIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Destination" secondary={props.destination} />
            </ListItem>
          )}
          <ListItem>
            <ListItemIcon>
              <AccountBoxIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Initiator" secondary={props.initiator} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ScheduleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary="Timestamp"
              secondary={props.time.toLocaleString(DateTime.DATETIME_SHORT)}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <MoneyIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText
              primary="Amount"
              secondary={currencyFormatter.format(props.amount)}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CommentIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Note" secondary={props.note} />
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

export default function TransactionsPage(): JSX.Element {
  const classes = useStyles();

  const transactions = useSelector((state: IStoreState) => state.messages.transactions);

  return (
    <div className={classes.root}>
      {transactions.length <= 0 && (
        <Typography color="secondary" variant="h4" className={classes.headingNone}>
          No transaction history available
        </Typography>
      )}
      {transactions.map((transaction) => {
        return <Transaction key={transaction.id} {...transaction} />;
      })}
    </div>
  );
}
