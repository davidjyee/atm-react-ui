import { ThunkResult, ThunkDispatch, IStoreState } from '../store';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
  START_TRANSFER,
  FINISH_TRANSFER,
  SWAP_ACCOUNT,
} from './types';
import { commitTransaction } from './messageActions';
import { Transaction, UserId, AccountId } from '../types';
import { DateTime } from 'luxon';

export function deposit(
  by: UserId,
  amount: number,
  into: AccountId
): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (state.account.transactionLock) {
      throw new Error('CANNOT DEPOSIT: BANK ACCOUNT LOCKED');
    } else if (state.status.transactionLock) {
      throw new Error('CANNOT DEPOSIT: CASH ACCOUNT LOCKED');
    }

    dispatch({
      type: START_DEPOSIT,
    });

    const transaction: Transaction = {
      id: Date.now(),
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
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (state.account.transactionLock) {
      throw new Error('CANNOT WITHDRAW: BANK ACCOUNT LOCKED');
    } else if (state.status.transactionLock) {
      throw new Error('CANNOT WITHDRAW: CASH ACCOUNT LOCKED');
    }

    dispatch({
      type: START_WITHDRAW,
    });

    const transaction: Transaction = {
      id: Date.now(),
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

export function transfer(
  by: UserId,
  amount: number,
  origin: AccountId,
  destination: AccountId,
  note: string
): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (state.account.transactionLock) {
      throw new Error('CANNOT TRANSFER: ACCOUNT LOCKED');
    }

    dispatch({
      type: START_TRANSFER,
    });

    const transaction: Transaction = {
      id: Date.now(),
      origin,
      destination,
      initiator: by,
      type: 'TRANSFER',
      time: DateTime.now(),
      amount,
      note,
    };

    const success = await dispatch(commitTransaction(transaction));

    dispatch({
      type: FINISH_TRANSFER,
      success,
      transaction,
    });
  };
}

export function swapAccount(
  to: AccountId
): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (state.account.transactionLock) {
      throw new Error('CANNOT SWAP: ACCOUNT LOCKED');
    }

    // Find the account to swap to
    const account = state.data.accounts.find((account) => account.id === to);

    if (!account) {
      throw new Error('INVALID ACCOUNT');
    }

    dispatch({
      type: SWAP_ACCOUNT,
      to: account,
    });
  };
}