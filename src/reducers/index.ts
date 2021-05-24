import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import accountReducer from './accountReducer';
import statusReducer from './statusReducer';
import pageReducer from './pageReducer';

export default combineReducers({
  messages: messageReducer,
  account: accountReducer,
  status: statusReducer,
  pageData: pageReducer,
});
