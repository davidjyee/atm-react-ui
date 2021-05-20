import React from 'react';
import './App.scss';

import Router from './components/Pages';
import Layout from './components/Layout';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#6d1aad',
    },
    secondary: {
      main: '#8c47b8',
    },
    background: {
      paper: '#141821',
      default: 'rgba(0, 0, 0, 0)',
    },
  },
});

export default function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Router />
        </Layout>
      </ThemeProvider>
    </div>
  );
}
