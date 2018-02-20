import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// eslint-disable-next-line react/prop-types
const AppContainer = ({ children }) => (
  <MuiThemeProvider>{children}</MuiThemeProvider>
);

export default AppContainer;
