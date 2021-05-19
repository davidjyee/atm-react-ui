import { AnyAction } from 'redux';
import { START_SHOW_UI, FINISH_SHOW_UI, START_DEPOSIT, FINISH_DEPOSIT } from '../actions';

const initialState = {
  show: true,
};

export default function messageReducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case FINISH_SHOW_UI:
      return {
        ...state,
        show: action.show,
      };
    case START_SHOW_UI:
    case START_DEPOSIT:
    case FINISH_DEPOSIT:
    default:
      return state;
  }
}
