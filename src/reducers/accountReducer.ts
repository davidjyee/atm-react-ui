import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
  START_TRANSFER,
  FINISH_TRANSFER,
  SWAP_ACCOUNT,
  START_ADD_ACCESS,
  FINISH_ADD_ACCESS,
  START_REMOVE_ACCESS,
  START_EDIT_ACCESS,
  FINISH_REMOVE_ACCESS,
  FINISH_EDIT_ACCESS,
  FINISH_SHOW_UI,
} from '../actions';

import { Account, AccountId, RoutingNumber, Transaction } from '../types';

interface AccountState extends Account {
  transactionLock: boolean;
}

const initialState: AccountState = {
  name: '',
  type: '',
  id: -1,
  routing: -1,
  balance: 0,
  transactionLock: false,
};

function transact(account: AccountState, action: AnyAction): AccountState {
  const newState = {
    ...account,
    transactionLock: false,
  };

  if (action.success) {
    const transaction: Transaction = action.transaction;

    switch (action.type) {
      case FINISH_DEPOSIT:
        newState.balance += transaction.amount;
        break;
      case FINISH_WITHDRAW:
        newState.balance -= transaction.amount;
        break;
      case FINISH_TRANSFER:
        if (transaction.destination === newState.routing) {
          newState.balance += transaction.amount;
        } else if (transaction.origin === newState.routing) {
          newState.balance -= transaction.amount;
        }
        break;
      default:
        break;
    }
  }

  return newState;
}

function loadData(state: AccountState, accounts: Array<Record<string, unknown>>) {
  const newState = { ...state };

  const account = accounts?.[0];

  // Load account
  if (account) {
    newState.id = account.id as AccountId;
    newState.routing = account.routing as RoutingNumber;
    newState.name = account.name as string;
    newState.type = account.type as string;
    newState.balance = account.balance as number;
  }

  return newState;
}

export default function accountReducer(
  state: AccountState = initialState,
  action: AnyAction
): AccountState {
  switch (action.type) {
    case START_WITHDRAW:
    case START_DEPOSIT:
    case START_TRANSFER:
    case START_ADD_ACCESS:
    case START_REMOVE_ACCESS:
    case START_EDIT_ACCESS:
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_WITHDRAW:
    case FINISH_DEPOSIT:
    case FINISH_TRANSFER:
      return transact(state, action);
    case SWAP_ACCOUNT:
      return {
        ...action.to,
        transactionLock: false,
      };
    case FINISH_ADD_ACCESS:
    case FINISH_REMOVE_ACCESS:
    case FINISH_EDIT_ACCESS:
      return {
        ...state,
        transactionLock: false,
      };
    case FINISH_SHOW_UI:
      return {
        ...loadData(state, action.accounts),
        transactionLock: false,
      };
    default:
      return state;
  }
}
