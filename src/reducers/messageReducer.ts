import { AnyAction } from 'redux';
import {
  START_SHOW_UI,
  FINISH_SHOW_UI,
  START_TRANSACTION_MESSAGE,
  FINISH_TRANSACTION_MESSAGE,
} from '../actions';

interface messages {
  show: boolean;
  transactionLock: boolean;
}

const initialState: messages = {
  show: true,
  transactionLock: true,
};

export default function messageReducer(
  state = initialState,
  action: AnyAction
): messages {
  switch (action.type) {
    case FINISH_SHOW_UI:
      return {
        ...state,
        show: action.show,
      };
    case START_SHOW_UI:
    case START_TRANSACTION_MESSAGE:
      return {
        ...state,
        transactionLock: true,
      };
    case FINISH_TRANSACTION_MESSAGE:
      return {
        ...state,
        transactionLock: false,
      };
    default:
      return state;
  }
}
