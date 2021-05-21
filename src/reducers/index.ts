import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import accountReducer from './accountReducer';

export default combineReducers({
  messages: messageReducer,
  account: accountReducer,
});
