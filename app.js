/* eslint-disable no-console */

const mongoose = require('mongoose');
const logger = require('morgan');
const express = require('express');

const app = express();
const helmet = require('helmet');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const passportSocketIo = require('passport.socketio');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const compression = require('compression');
const path = require('path');
const mockgoose = require('mockgoose');

const config = require('./config/');
const routes = require('./routes');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'test') {
  console.log('database mocked');

  mockgoose(mongoose).then(() => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/chat_dev');
  });
} else {
  console.log('database not mocked');

  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/chat_dev');
}

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
const sessionSettings = {
  key: 'express.sid',
  store: sessionStore,
  secret: process.env.SESSION_SECRET || config.session.secret,
  cookie: { httpOnly: false },
};
const middlewares = [
  helmet(),
  logger('dev'),
  compression(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session(sessionSettings),
  passport.initialize(),
  passport.session(),
];

middlewares.forEach(middleware => app.use(middleware));

app.use('/', routes);

if (process.env.NODE_ENV === 'development') {
  console.log('Webpack dev middleware enabled');

  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  // eslint-disable-next-line global-require
  const webpackConfig = require('./webpack.config.dev.js');
  const compiler = webpack(webpackConfig);

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }));

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  console.log('Serving production bundle');

  app.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'bundle.js'));
  });
  app.get('/bundle.js.map', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'bundle.js.map'));
  });
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.use(passportSocketIo.authorize({
  key: 'express.sid',
  secret: config.session.secret,
  store: sessionStore,
  success: (data, accept) => {
    accept();
  },
  fail: (data, message, error, accept) => {
    if (error) {
      console.log(`error: ${message}`);

      accept(new Error('Unauthorized'));
    } else {
      console.log(`ok: ${message}`);
      accept(new Error('Unauthorized'));
    }
  },
}));

// setup dependencies
require('./config/passport')(config, passport);
require('./socket.js')(config, io);

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  http.listen(port, () => {
    console.log(`listening on *:${port}`);
  });
}

module.exports = {
  http,
  mockgoose: process.env.NODE_ENV === 'test' ? mockgoose : null,
};
