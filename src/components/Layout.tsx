import React from 'react';

import { IStoreState } from '../store';
import { useSelector } from 'react-redux';

import Paper from '@material-ui/core/Paper';

interface LayoutProps {
  children: any;
}

export default function Layout(props: LayoutProps) {
  const show = useSelector((state: IStoreState) => state.messages.show);

  return (
    show && (
      <Paper variant="outlined" square>
        {props.children}
      </Paper>
    )
  );
}
