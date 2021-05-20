import React from 'react';

import { ThunkDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { deposit } from '../../actions';

import Button from '@material-ui/core/Button';

export default function ActionsPage() {
  const dispatch: ThunkDispatch = useDispatch();

  return (
    <div className="ActionsPage">
      <Button
        onClick={() => dispatch(deposit(50)).then(console.log)}
        variant="contained"
        color="primary"
      >
        Deposit
      </Button>
    </div>
  );
}
