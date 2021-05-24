import { AnyAction } from 'redux';
import {
  START_SHOW_UI,
  FINISH_SHOW_UI,
  START_TRANSACTION_MESSAGE,
  FINISH_TRANSACTION_MESSAGE,
} from '../actions';
import { AccessInfo, Account, Transaction } from '../types';
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
      accessLevel: 0,
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
      destination: 1234567890,
      initiator: 816,
      time: DateTime.now(),
      amount: 100,
      note: 'Cash Deposit',
    },
    {
      id: 1,
      type: 'WITHDRAWAL',
      origin: 1234567890,
      destination: null,
      initiator: 816,
      time: DateTime.now(),
      amount: -100,
      note: 'Cash Withdrawal',
    },
    {
      id: 2,
      type: 'TRANSFER',
      origin: 1234567890,
      destination: 9876543210,
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

    console.log('COMMITTING_TRANSACTION');

    // Remove money from origin account if known account
    const originAccount = accountsCopy.find(
      (account: Account) => account.id === transaction.origin
    );
    if (originAccount) {
      originAccount.balance -= transaction.amount;
    }

    // Add money to destination account if known account
    const destinationAccount = accountsCopy.find(
      (account: Account) => account.id === transaction.destination
    );
    if (destinationAccount) {
      destinationAccount.balance += transaction.amount;
    }

    const transactionsCopy = [...state.transactions];

    // Add the transaction to the log
    transactionsCopy.push(transaction);

    return {
      ...state,
      accounts: accountsCopy,
      transactions: transactionsCopy,
    };
  } else {
    return {};
  }
}

export default function messageReducer(state = initialState, action: AnyAction): data {
  switch (action.type) {
    case START_SHOW_UI:
    case START_TRANSACTION_MESSAGE:
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
    default:
      return state;
  }
}
