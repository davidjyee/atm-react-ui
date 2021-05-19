import { ThunkResult, ThunkDispatch } from '../store';
import { START_SHOW_UI } from './types';

export function showAtmUi(visibility: boolean): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: START_SHOW_UI,
    });

    //Set the focus of the application
    fetch(`https://atm-esx-react-example/focus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        focus: visibility,
      }),
    });
  };
}
