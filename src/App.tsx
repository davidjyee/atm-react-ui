import React from 'react';

import Pages from './components/Pages';
import Layout from './components/Layout';

import store from './store';
import { Provider } from 'react-redux';

import { CssBaseline, NoSsr } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { HashRouter as Router } from 'react-router-dom';

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
      default: '#141821',
      paper: '#1e2330',
    },
  },
});

const cssTheme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: 'rgba(0, 0, 0, 1)',
    },
  },
});

export default function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <NoSsr>
          <ThemeProvider theme={cssTheme}>
            <CssBaseline />
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Router>
              <Layout>
                <Pages />
              </Layout>
            </Router>
          </ThemeProvider>
        </NoSsr>
      </Provider>
    </div>
  );
}
