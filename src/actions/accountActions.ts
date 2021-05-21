import { ThunkResult, ThunkDispatch } from '../store';
import { START_DEPOSIT, FINISH_DEPOSIT, START_WITHDRAW, FINISH_WITHDRAW } from './types';
import { commitDeposit } from './messageActions';

export function deposit(amount: number): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: START_DEPOSIT,
    });

    const success = await dispatch(commitDeposit(amount));

    dispatch({
      type: FINISH_DEPOSIT,
      success,
      amount,
    });
  };
}

export function withdraw(amount: number): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: START_WITHDRAW,
    });

    const success = await dispatch(commitDeposit(amount));

    dispatch({
      type: FINISH_WITHDRAW,
      success,
      amount,
    });
  };
}
