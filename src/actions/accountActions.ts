import { ThunkResult, ThunkDispatch } from '../store';
import { START_DEPOSIT, FINISH_DEPOSIT, START_WITHDRAW, FINISH_WITHDRAW } from './types';
import { commitTransaction } from './messageActions';
import { Transaction, UserId, AccountId } from '../types';
import { DateTime } from 'luxon';

export function deposit(
  by: UserId,
  amount: number,
  into: AccountId
): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: START_DEPOSIT,
    });

    const transaction: Transaction = {
      id: -1,
      origin: null,
      destination: into,
      initiator: by,
      type: 'DEPOSIT',
      time: DateTime.now(),
      amount,
      note: 'Cash deposit',
    };

    const success = await dispatch(commitTransaction(transaction));

    dispatch({
      type: FINISH_DEPOSIT,
      success,
      transaction,
    });
  };
}

export function withdraw(
  by: UserId,
  amount: number,
  from: AccountId
): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: START_WITHDRAW,
    });

    const transaction: Transaction = {
      id: -1,
      origin: from,
      destination: null,
      initiator: by,
      type: 'WITHDRAWAL',
      time: DateTime.now(),
      amount,
      note: 'Cash withdrawal',
    };

    const success = await dispatch(commitTransaction(transaction));

    dispatch({
      type: FINISH_WITHDRAW,
      success,
      transaction,
    });
  };
}
