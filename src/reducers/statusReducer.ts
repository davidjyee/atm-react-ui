import { AnyAction } from 'redux';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
} from '../actions';

import { User } from '../types';

interface Status extends User {
  cash: number;
  transactionLock: boolean;
}

const initialState: Status = {
  name: 'Akihiro Sakamoto',
  id: 816,
  cash: 100,
  transactionLock: false,
};

function transact(account: Status, action: AnyAction): Status {
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
    default:
      return state;
  }
}
