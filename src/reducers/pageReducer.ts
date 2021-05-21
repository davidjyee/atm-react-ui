import { AnyAction } from 'redux';
import { SET_PARAMETER } from '../actions';

interface pageData {
  [key: string]: any;
}

const initialState: pageData = {};

export default function pageReducer(state = initialState, action: AnyAction): pageData {
  switch (action.type) {
    case SET_PARAMETER:
      return {
        ...state,
        [action.id]: action.value,
      };
    default:
      return state;
  }
}
