import { AnyAction } from 'redux';
import { CLEAR_PARAMETERS, SET_PARAMETER, SWAP_ACCOUNT } from '../actions';

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
    case SWAP_ACCOUNT:
    case CLEAR_PARAMETERS:
      return {};
    default:
      return state;
  }
}
