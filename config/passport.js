const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function setupPassport(config, passport) {
  passport.serializeUser((user, done) => {
    done(null, user.local.username);
  });

  passport.deserializeUser((username, done) => {
    done(null, username);
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
        (req, username, password, done) => {
          User.findOne({ 'local.username': username.toLowerCase() }, (err, user) => {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(null, false);
            }
            const newUser = new User();

            newUser.local.username = username.toLowerCase();
            newUser.local.password = newUser.generateHash(password);
            newUser.local.channels = [config.defaultChannel.toLowerCase()];
            return newUser.save((saveErr) => {
              if (saveErr) {
                throw saveErr;
              }
              return done(null, newUser);
            });
          });
        }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
        (req, username, password, done) => {
          User.findOne({ 'local.username': username.toLowerCase() }, (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false);
            }
            if (!user.validPassword(password)) {
              return done(null, false);
            }
            return done(null, user);
          });
        }));
};
