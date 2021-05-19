import store, { ThunkDispatch } from './store';
import { showAtmUi } from './actions';

const dispatch: ThunkDispatch = store.dispatch;

window.addEventListener('message', (event) => {
  if (event.data.type === 'atm-visibility') {
    dispatch(showAtmUi(event.data.visibility));
  }
});
