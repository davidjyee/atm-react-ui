import { ThunkResult, ThunkDispatch } from '../store';
import { CLEAR_PARAMETERS, SET_PARAMETER } from './types';

export function setParameter(id: string, value: unknown): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: SET_PARAMETER,
      id,
      value,
    });
  };
}

export function clearParameters(): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: CLEAR_PARAMETERS,
    });
  };
}
