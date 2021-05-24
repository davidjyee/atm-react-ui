import { ThunkResult, ThunkDispatch, IStoreState } from '../store';
import {
  START_SHOW_UI,
  FINISH_SHOW_UI,
  START_TRANSACTION_MESSAGE,
  FINISH_TRANSACTION_MESSAGE,
} from './types';

import { Transaction } from '../types';

const resourceName = 'atm-esx-react-example';
const fetchHeaders = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
};

async function safeJSONParse(res: Response) {
  if (res.ok) {
    const json = await res.json();

    return json;
  } else {
    throw new Error('INVALID RESPONSE');
  }
}

export function showUI(visibility: boolean, type?: string): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (!visibility && state.data.transactionLock) {
      throw new Error('CANNOT EXIT ATM: DATA TRANSMISSION ONGOING');
    }

    dispatch({
      type: START_SHOW_UI,
    });

    //Set the focus of the application
    fetch(`https://${resourceName}/focus`, {
      ...fetchHeaders,
      body: JSON.stringify({
        focus: visibility,
      }),
    });

    dispatch({
      type: FINISH_SHOW_UI,
      show: visibility,
      interfaceType: type,
    });
  };
}

export function commitTransaction(
  transaction: Transaction
): ThunkResult<Promise<boolean>> {
  return async (
    dispatch: ThunkDispatch,
    getState: () => IStoreState
  ): Promise<boolean> => {
    const state = getState();

    // Check for transaction lock first
    if (state.data.transactionLock) {
      throw new Error('CANNOT COMMIT TRANSACTION: DATA TRANSMISSION ONGOING');
    }

    dispatch({
      type: START_TRANSACTION_MESSAGE,
    });

    //commit the transaction
    const res: Response = await fetch(`https://${resourceName}/transaction/commit`, {
      ...fetchHeaders,
      body: JSON.stringify(transaction),
    });

    const json = await safeJSONParse(res);

    dispatch({
      type: FINISH_TRANSACTION_MESSAGE,
      transaction,
      success: json.success,
    });

    return json.success;
  };
}
