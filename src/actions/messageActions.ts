import { ThunkResult, ThunkDispatch } from '../store';
import {
  START_SHOW_UI,
  FINISH_SHOW_UI,
  START_TRANSACTION_MESSAGE,
  FINISH_TRANSACTION_MESSAGE,
} from './types';

import { Transaction } from '../types';

const resourceName = 'atm-esx-react-example';

async function safeJSONParse(res: Response) {
  if (res.ok) {
    const json = await res.json();

    return json;
  } else {
    throw new Error('INVALID RESPONSE');
  }
}

export function showUI(visibility: boolean): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: START_SHOW_UI,
    });

    //Set the focus of the application
    fetch(`https://${resourceName}/focus`, {
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

export function commitTransaction(
  transaction: Transaction
): ThunkResult<Promise<boolean>> {
  return async (dispatch: ThunkDispatch): Promise<boolean> => {
    dispatch({
      type: START_TRANSACTION_MESSAGE,
    });

    //Deposit the amount
    const res: Response = await fetch(`https://${resourceName}/transaction/commit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(transaction),
    });

    const json = await safeJSONParse(res);

    dispatch({
      type: FINISH_TRANSACTION_MESSAGE,
    });

    return json.success;
  };
}
