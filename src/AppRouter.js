import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import AppContainer from './AppContainer';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';

const AppRouter = () => {
  const routes = (<Route path="/" component={AppContainer}>
    <IndexRoute component={Login} />
    <Route path="chat" component={Chat} />
    <Route path="register" component={Register} />
  </Route>);

  return (
    <Router history={browserHistory}>
      {routes}
    </Router>
  );
};

export default AppRouter;
