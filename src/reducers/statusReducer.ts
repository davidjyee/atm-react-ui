import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
} from '../actions';

interface status {
  name: string;
  id: number;
  cash: number;
  transactionLock: boolean;
}

const initialState: status = {
  name: 'Akihiro Sakamoto',
  id: 816,
  cash: 100,
  transactionLock: false,
};

function transact(account: status, action: AnyAction): status {
  const newState = {
    ...account,
    transactionLock: false,
  };

  if (action.success) {
    switch (action.type) {
      case FINISH_DEPOSIT:
        newState.cash -= action.amount;
        break;
      case FINISH_WITHDRAW:
        newState.cash += action.amount;
        break;
      default:
        break;
    }
  }

  return newState;
}

export default function statusReducer(state = initialState, action: AnyAction): status {
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
