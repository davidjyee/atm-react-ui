import { ThunkResult, ThunkDispatch } from '../store';
import { SET_PARAMETER } from './types';

export function setParameter(id: string, value: any): ThunkResult<Promise<void>> {
  return async (dispatch: ThunkDispatch): Promise<void> => {
    dispatch({
      type: SET_PARAMETER,
      id,
      value,
    });
  };
}
