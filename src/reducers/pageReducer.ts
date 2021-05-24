import { AnyAction } from 'redux';
import {
  CLEAR_PARAMETERS,
  SET_PARAMETER,
  SWAP_ACCOUNT,
  FINISH_WITHDRAW,
  FINISH_DEPOSIT,
  FINISH_TRANSFER,
} from '../actions';

interface pageData {
  [key: string]: unknown;
}

const initialState: pageData = {};

export default function pageReducer(state = initialState, action: AnyAction): pageData {
  switch (action.type) {
    case SET_PARAMETER:
      return {
        ...state,
        [action.id]: action.value,
      };
    case FINISH_WITHDRAW:
    case FINISH_DEPOSIT:
    case FINISH_TRANSFER:
    case SWAP_ACCOUNT:
    case CLEAR_PARAMETERS:
      return {};
    default:
      return state;
  }
}
