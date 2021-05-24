import { AnyAction } from 'redux';
import { FINISH_SHOW_UI } from '../actions';

interface interfaceData {
  show: boolean;
  type: string | null;
  allowedTabs: Array<string>;
  allowedActions: Array<string>;
}

const initialState: interfaceData = {
  show: true,
  type: 'fleeca-teller',
  allowedTabs: ['actions', 'details', 'manage', 'transactions'],
  allowedActions: ['deposit', 'withdraw', 'transfer'],
};

function getRestrictions(type: string) {
  switch (type) {
    case 'fleeca-teller':
      return {
        allowedTabs: ['actions', 'details', 'manage', 'transactions'],
        allowedActions: ['deposit', 'withdraw', 'transfer'],
      };
    case 'fleeca-atm':
      return {
        allowedTabs: ['actions', 'details', 'transactions'],
        allowedActions: ['deposit', 'withdraw', 'transfer'],
      };
    case 'atm':
    default:
      return {
        allowedTabs: ['actions', 'details', 'transactions'],
        allowedActions: ['withdraw'],
      };
  }
}

export default function interfaceReducer(
  state = initialState,
  action: AnyAction
): interfaceData {
  switch (action.type) {
    case FINISH_SHOW_UI:
      return {
        ...state,
        ...getRestrictions(action.interfaceType ? action.interfaceType : state.type),
        show: action.show,
        type: action.interfaceType ? action.interfaceType : state.type,
      };
    default:
      return state;
  }
}
