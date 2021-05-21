import { AnyAction } from 'redux';
import { START_DEPOSIT, FINISH_DEPOSIT } from '../actions';

interface account {
  name: string;
  number: number;
  balance: number;
  transactionLock: boolean;
}

const initialState: account = {
  name: 'Personal',
  number: 1234567890,
  balance: 100,
  transactionLock: false,
};

function transact(account: account, action: AnyAction): account {
  const newState = {
    ...account,
    transactionLock: false,
  };

  if (action.success) {
    switch (action.type) {
      case FINISH_DEPOSIT:
        newState.balance += action.amount;
        break;
      default:
        break;
    }
  }

  return newState;
}

export default function accountReducer(state = initialState, action: AnyAction): account {
  switch (action.type) {
    case START_DEPOSIT:
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_DEPOSIT:
      return transact(state, action);
    default:
      return state;
  }
}
