import { AnyAction } from 'redux';
import {
  START_SHOW_UI,
  FINISH_SHOW_UI,
  START_TRANSACTION_MESSAGE,
  FINISH_TRANSACTION_MESSAGE,
  START_ADD_ACCESS_MESSAGE,
  FINISH_ADD_ACCESS_MESSAGE,
  FINISH_REMOVE_ACCESS_MESSAGE,
  FINISH_EDIT_ACCESS_MESSAGE,
  START_REMOVE_ACCESS_MESSAGE,
  START_EDIT_ACCESS_MESSAGE,
} from '../actions';
import { AccessId, AccessInfo, Account, Transaction } from '../types';
import { DateTime } from 'luxon';

interface data {
  access: Array<AccessInfo>;
  accounts: Array<Account>;
  transactions: Array<Transaction>;
  transactionLock: boolean;
}

const initialState: data = {
  access: [
    {
      id: 0,
      userId: 816,
      accountId: 1234567890,
      accessLevel: 1,
    },
    {
      id: 1,
      userId: 816,
      accountId: 9876543210,
      accessLevel: 1,
    },
  ],
  accounts: [
    {
      name: 'Personal',
      type: 'Personal',
      routing: 100,
      id: 1234567890,
      balance: 100,
    },
    {
      name: 'Pillbox',
      type: 'Business',
      routing: 200,
      id: 9876543210,
      balance: 1000,
    },
  ],
  transactions: [
    {
      id: 0,
      type: 'DEPOSIT',
      origin: null,
      destination: 100,
      initiator: 816,
      time: DateTime.now(),
      amount: 100,
      note: 'Cash Deposit',
    },
    {
      id: 1,
      type: 'WITHDRAWAL',
      origin: 100,
      destination: null,
      initiator: 816,
      time: DateTime.now(),
      amount: -100,
      note: 'Cash Withdrawal',
    },
    {
      id: 2,
      type: 'TRANSFER',
      origin: 100,
      destination: 200,
      initiator: 816,
      time: DateTime.now(),
      amount: 100,
      note: 'Test transfer',
    },
  ],
  transactionLock: false,
};

function commitTransaction(state: data, transaction: Transaction, success: boolean) {
  if (success) {
    const accountsCopy = [...state.accounts];

    // Remove money from origin account if known account
    const originAccount = accountsCopy.find(
      (account: Account) => account.routing === transaction.origin
    );
    if (originAccount) {
      originAccount.balance -= transaction.amount;
    }

    // Add money to destination account if known account
    const destinationAccount = accountsCopy.find(
      (account: Account) => account.routing === transaction.destination
    );
    if (destinationAccount) {
      destinationAccount.balance += transaction.amount;
    }

    const transactionsCopy = [...state.transactions];

    // Add the transaction to the log
    transactionsCopy.push(transaction);

    return {
      accounts: accountsCopy,
      transactions: transactionsCopy,
    };
  } else {
    return {};
  }
}

function addAccess(state: data, access: AccessInfo, success: boolean) {
  if (success) {
    return {
      access: [...state.access, access],
    };
  } else {
    return {};
  }
}

function removeAccess(state: data, id: AccessId, success: boolean) {
  if (success) {
    const accessMap = state.access.filter((info) => info.id !== id);

    return {
      access: accessMap,
    };
  } else {
    return {};
  }
}

function editAccess(
  state: data,
  id: AccessId,
  accessLevel: AccessLevel,
  success: boolean
) {
  if (success) {
    const accessMap = state.access.filter((info) => info.id !== id);

    const access: AccessInfo = {
      id,
      userId: -1,
      accountId: -1,
      ...state.access.find((info) => info.id === id),
      accessLevel,
    };

    accessMap.push(access);
    return {
      access: accessMap,
    };
  } else {
    return {};
  }
}

export default function messageReducer(state = initialState, action: AnyAction): data {
  switch (action.type) {
    case START_SHOW_UI:
    case START_TRANSACTION_MESSAGE:
    case START_ADD_ACCESS_MESSAGE:
    case START_REMOVE_ACCESS_MESSAGE:
    case START_EDIT_ACCESS_MESSAGE:
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_SHOW_UI:
    case FINISH_TRANSACTION_MESSAGE:
      return {
        ...state,
        ...commitTransaction(state, action.transaction, action.success),
        transactionLock: false,
      };
    case FINISH_ADD_ACCESS_MESSAGE:
      return {
        ...state,
        ...addAccess(state, action.access, action.success),
        transactionLock: false,
      };
    case FINISH_REMOVE_ACCESS_MESSAGE:
      return {
        ...state,
        ...removeAccess(state, action.id, action.success),
        transactionLock: false,
      };
    case FINISH_EDIT_ACCESS_MESSAGE:
      return {
        ...state,
        ...editAccess(state, action.id, action.accessLevel, action.success),
        transactionLock: false,
      };
    default:
      return state;
  }
}
