import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
  SWAP_ACCOUNT,
  FINISH_SHOW_UI,
} from '../actions';

import { User, Transaction, AccessLevel, AccessInfo } from '../types';

interface Status extends User {
  cash: number;
  accountAccess: AccessLevel;
  transactionLock: boolean;
}

const initialState: Status = {
  name: '',
  id: -1,
  cash: 0,
  accountAccess: 0,
  transactionLock: false,
};

function transact(account: Status, action: AnyAction): Status {
  const newState = {
    ...account,
    transactionLock: false,
  };

  if (action.success) {
    const transaction: Transaction = action.transaction;

    switch (action.type) {
      case FINISH_DEPOSIT:
        newState.cash -= transaction.amount;
        break;
      case FINISH_WITHDRAW:
        newState.cash += transaction.amount;
        break;
      default:
        break;
    }
  }

  return newState;
}

function updateAccess(state: Status, accessMap: Array<AccessInfo>): AccessLevel {
  const accessLevel = accessMap.find(
    (info: AccessInfo) => info.userId === state.id
  )?.accessLevel;

  if (accessLevel) {
    return accessLevel;
  } else {
    return 0;
  }
}

function loadData(
  state: Status,
  user: Record<string, unknown>,
  access: Array<Record<string, unknown>>,
  accounts: Array<Record<string, unknown>>
) {
  const newState = { ...state, ...user };

  // Find the access level of the first account
  const accountId = accounts[0].id;

  const accessInfo = access.find(
    (info) => info.accountId === accountId && info.userId === user.id
  );
  const accessLevel: AccessLevel = accessInfo?.['accessLevel'] as AccessLevel;

  if (accessLevel) {
    newState.accountAccess = accessLevel;
  }

  return newState;
}

export default function statusReducer(
  state: Status = initialState,
  action: AnyAction
): Status {
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
    case SWAP_ACCOUNT:
      return {
        ...state,
        accountAccess: updateAccess(state, action.accessMap),
      };
    case FINISH_SHOW_UI:
      return {
        ...loadData(state, action.user, action.access, action.accounts),
        transactionLock: false,
      };
    default:
      return state;
  }
}
