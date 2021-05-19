import { ThunkResult, ThunkDispatch } from '../store';
import { START_SHOW_UI, FINISH_SHOW_UI, START_DEPOSIT, FINISH_DEPOSIT } from './types';

export function showUI(visibility: boolean): ThunkResult<Promise<void>> {
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

    dispatch({
      type: FINISH_SHOW_UI,
      show: visibility,
    });
  };
}

export function deposit(amount: number): ThunkResult<Promise<boolean>> {
  return async (dispatch: ThunkDispatch): Promise<boolean> => {
    dispatch({
      type: START_DEPOSIT,
    });

    //Deposit the amount
    const res: Response = await fetch(`https://atm-esx-react-example/deposit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        amount,
      }),
    });

    const json: any = await res.json();

    dispatch({
      type: FINISH_DEPOSIT,
      amount,
    });

    return json.success;
  };
}
