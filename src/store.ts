import { createStore, applyMiddleware } from 'redux';
import thunk, { ThunkDispatch as TDispatch, ThunkAction } from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};

const composeEnhancers = composeWithDevTools({ name: 'atm-react-ui' });

// apply middleware (thunk) for async dispatch
const middlewareEnhancer = applyMiddleware(thunk);

// compose our middleware into an enhancer
// add Redux dev tools enhancer for use with Chrome extension
const composedEnhancers = composeEnhancers(middlewareEnhancer);

const store = createStore(rootReducer, initialState, composedEnhancers);

export type IStoreAction = ReturnType<Dispatch>;
export type IStoreState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;
export type ThunkResult<R> = ThunkAction<R, IStoreState, null, IStoreAction>;
export type ThunkDispatch = TDispatch<IStoreState, null, IStoreAction>;

export default store;
