import store, { ThunkDispatch } from './store';
import { showUI } from './actions';

const dispatch: ThunkDispatch = store.dispatch;

window.addEventListener('message', (event) => {
  if (event.data.type === 'atm-visibility') {
    dispatch(showUI(event.data.visibility));
  }
});
