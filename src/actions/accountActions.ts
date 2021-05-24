import { ThunkResult, ThunkDispatch, IStoreState } from '../store';
import {
  START_DEPOSIT,
  FINISH_DEPOSIT,
  START_WITHDRAW,
  FINISH_WITHDRAW,
  START_TRANSFER,
  FINISH_TRANSFER,
  SWAP_ACCOUNT,
  START_ADD_ACCESS,
  FINISH_ADD_ACCESS,
  START_REMOVE_ACCESS,
  FINISH_REMOVE_ACCESS,
} from './types';
import {
  commitTransaction,
  addAccessMessage,
  removeAccessMessage,
} from './messageActions';
import { Transaction, UserId, AccountId, RoutingNumber, AccessId } from '../types';
import { DateTime } from 'luxon';

export function deposit(
  by: UserId,
  amount: number,
  into: RoutingNumber
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
  from: RoutingNumber
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
  origin: RoutingNumber,
  destination: RoutingNumber,
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

export function swapAccount(to: AccountId): ThunkResult<Promise<void>> {
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

export function addAccess(
  userId: UserId,
  accountId: AccountId,
  accessLevel: number
): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (state.account.transactionLock) {
      throw new Error('CANNOT ADD ACCESS: ACCOUNT LOCKED');
    }

    dispatch({
      type: START_ADD_ACCESS,
    });

    const access = {
      id: Date.now(),
      userId,
      accountId,
      accessLevel,
    };

    const success = await dispatch(addAccessMessage(access));

    dispatch({
      type: FINISH_ADD_ACCESS,
      access,
      success,
    });
  };
}

export function removeAccess(id: AccessId): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch, getState: () => IStoreState): Promise<void> => {
    const state = getState();

    // Check for transaction lock first
    if (state.account.transactionLock) {
      throw new Error('CANNOT ADD ACCESS: ACCOUNT LOCKED');
    }

    dispatch({
      type: START_REMOVE_ACCESS,
    });

    const success = await dispatch(removeAccessMessage(id));

    dispatch({
      type: FINISH_REMOVE_ACCESS,
      id,
      success,
    });
  };
}
