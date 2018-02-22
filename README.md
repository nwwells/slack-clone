Slack clone - A real time chat service
======================================

** I'm not going to maintain this repo anymore, but feel free to fork or create PRs **

[![Build Status](https://travis-ci.org/avrj/slack-clone.svg?branch=master)](https://travis-ci.org/avrj/slack-clone) [![codecov](https://codecov.io/gh/avrj/slack-clone/branch/master/graph/badge.svg?token=ettfcfGuOA)](https://codecov.io/gh/avrj/slack-clone)

Demo: [https://zh47.herokuapp.com](https://zh47.herokuapp.com)

Stack:

- React
- Socket.io
- Express
- Node.js
- MongoDB
- Docker (optional)

I didn't use any state container (like Redux) yet, but it might be useful in the future to avoid passing data between components.

User stories
------------

- Users can choose a nickname
- Users can join chatrooms of their own choosing
- Users can send messages to other users

Features
--------

- Mobile-friendly UI (Material-UI)
- Stores messages on the server (only messages from channels are saved at the moment, but it's quite easy to extend it to support private messages also)
- Supports multiple logged clients at the same time from one user (e.g. desktop & mobile clients)
- Authentication is made with Passport.js which makes other sign up methods easy to implement (e.g. Facebook OAuth)
- Highlights unread conversations
- Keeps list of online users in real time

Install & run
-------------

The server includes webpack-dev-middleware & webpack-hot-middleware to show code changes on browser without refreshing

```bash
npm install
npm start
```

Also, docker:

```bash
docker build --tag slack-clone .
docker run \
  --interactive \
  --tty \
  --name slack-clone \
  --rm \
  --publish 3000:3000/tcp \
  --expose 3000/tcp \
  --link mongo \
  --env 'MONGODB_URI=mongodb://mongo/chat_dev' \
  slack-clone:latest
```

Testing (Mocha & Chai)
--------

Most of the real time and routes api are covered in the tests.

```bash
npm test
```

Coverage report (Istanbul)
--------

Coverage report can be generated by running

```bash
npm run coverage
```

Linting (ESlint)
--------

```bash
npm run lint
```

to fix most of the warnings automatically:

```bash
npm run lint:fix
```
