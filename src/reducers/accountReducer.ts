import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
} from '../actions';

import { Account, Transaction } from '../types';

interface AccountState extends Account {
  transactionLock: boolean;
}

const initialState: AccountState = {
  name: 'Personal',
  type: 'Personal',
  owner: 816,
  accessors: [],
  transactions: [],
  id: 1234567890,
  balance: 100,
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
      default:
        break;
    }
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
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_WITHDRAW:
    case FINISH_DEPOSIT:
      return transact(state, action);
    default:
      return state;
  }
}
