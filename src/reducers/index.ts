import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import accountReducer from './accountReducer';
import statusReducer from './statusReducer';

export default combineReducers({
  messages: messageReducer,
  account: accountReducer,
  status: statusReducer,
});
