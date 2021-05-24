import React, { ChangeEvent } from 'react';

import { IStoreState, ThunkDispatch } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { setParameter, addAccess, removeAccess } from '../../actions';

import {
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItem,
  List,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  TextField,
  IconButton,
  ListItemSecondaryAction,
  MenuItem,
  SelectProps,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  AccountBox as AccountBoxIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@material-ui/icons';

import { AccessInfo } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
    },
  })
);

function AccessDetails(props: AccessInfo): JSX.Element {
  const dispatch = useDispatch();
  const status = useSelector((state: IStoreState) => state.status);

  const canEdit = status.id !== props.userId;
  const canDelete = status.id !== props.userId;

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <AccountBoxIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`State ID: ${props.userId}`}
        secondary={`Access Level: ${props.accessLevel}`}
      />
      <ListItemSecondaryAction>
        <IconButton
          disabled={!canEdit}
          edge="end"
          onClick={() => dispatch(setParameter('edit-access-dialog-open', true))}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          disabled={!canDelete}
          edge="end"
          onClick={() => dispatch(removeAccess(props.id))}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

interface accessIdCheck {
  error: boolean;
  message?: string;
  id: number;
}

function validateAccessId(
  accessMap: Array<AccessInfo>,
  fieldValue?: string
): accessIdCheck {
  const numberRegex = /^\d+$/;

  // Check if number
  if (!fieldValue || !numberRegex.test(fieldValue)) {
    return {
      error: true,
      message: 'Must be a number',
      id: -1,
    };
  }

  const id = parseInt(fieldValue);

  // Check if state id already exists
  if (accessMap.find((access) => access.userId === id)) {
    return {
      error: true,
      message: 'State ID already has access',
      id: -1,
    };
  }

  return {
    error: false,
    id,
  };
}

function AddAccess(): JSX.Element {
  const dispatch: ThunkDispatch = useDispatch();

  const account = useSelector((state: IStoreState) => state.account);
  const accessMap = useSelector((state: IStoreState) => state.data.access);

  // Add access fields
  const accessIdFieldId = 'access-actions-id-field';
  const accessIdFieldValue = useSelector(
    (state: IStoreState) => state.pageData[accessIdFieldId]
  ) as string;

  const accessLevelFieldId = 'access-actions-level-field';
  const accessLevelFieldValue = useSelector(
    (state: IStoreState) => state.pageData[accessLevelFieldId]
  ) as number;

  // Validate fields
  const accessIdFieldCheck = validateAccessId(accessMap, accessIdFieldValue);

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <TextField
          label="State ID"
          variant="filled"
          value={accessIdFieldValue ? accessIdFieldValue : ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            dispatch(setParameter(accessIdFieldId, event.target.value))
          }
          error={Boolean(accessIdFieldValue) && accessIdFieldCheck.error}
          helperText={Boolean(accessIdFieldValue) && accessIdFieldCheck.message}
        />
      </Grid>
      <Grid item>
        <FormControl variant="filled">
          <InputLabel shrink id="select-access-level-label">
            Access Level
          </InputLabel>
          <Select
            labelId="select-access-level-label"
            id="select-access-level"
            value={accessLevelFieldValue + 1 ? accessLevelFieldValue + 1 : ''}
            displayEmpty
            onChange={(event: ChangeEvent<SelectProps>) =>
              dispatch(
                setParameter(accessLevelFieldId, (event.target.value as number) - 1)
              )
            }
          >
            <MenuItem value="" disabled>
              Select access of the new user
            </MenuItem>
            <MenuItem value={1}>Owner access</MenuItem>
            <MenuItem value={2}>Management access</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Divider />
      <Grid item>
        <Button
          onClick={() =>
            dispatch(addAccess(accessIdFieldCheck.id, account.id, accessLevelFieldValue))
          }
          variant="contained"
          color="primary"
          disabled={accessIdFieldCheck.error || !(accessLevelFieldValue + 1)}
        >
          Add Access
        </Button>
      </Grid>
    </Grid>
  );
}

export default function ManagementPage(): JSX.Element {
  const classes = useStyles();

  const account = useSelector((state: IStoreState) => state.account);
  const accessMap = useSelector((state: IStoreState) =>
    state.data.access.filter((access) => access.accountId === account.id)
  );

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Card className={classes.root}>
            <CardContent>
              <CardHeader
                title="Add Access"
                titleTypographyProps={{ color: 'secondary', variant: 'h4' }}
              />
              <AddAccess />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <Card className={classes.root}>
            <CardContent>
              <CardHeader
                title="Access"
                titleTypographyProps={{ color: 'secondary', variant: 'h4' }}
              />
              <Divider />
              <List>
                {accessMap.map((access) => {
                  return <AccessDetails key={access.id} {...access} />;
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
