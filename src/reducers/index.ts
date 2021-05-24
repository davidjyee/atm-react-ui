import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import accountReducer from './accountReducer';
import statusReducer from './statusReducer';
import pageReducer from './pageReducer';
import interfaceReducer from './interfaceReducer';

export default combineReducers({
  data: messageReducer,
  account: accountReducer,
  status: statusReducer,
  pageData: pageReducer,
  interface: interfaceReducer,
});
