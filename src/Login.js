import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import { Link, browserHistory } from 'react-router';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      signInError: false,
      showNotificationSnackbar: false,
      notificationSnackbarText: '',
    };
  }

  componentWillMount() {
    if (this.props.location.state) {
      if (this.props.location.state.message) {
        this.setState({
          showNotificationSnackbar: true,
          notificationSnackbarText: this.props.location.state.message,
        });
      }
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({ signInError: false });

    if (this.state.username.length >= 1 && this.state.password.length >= 1) this.authenticate();
  }

  authenticate = () => fetch('/api/authenticate',
    {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
        .then(response => response.json())
        .then((responseJson) => {
          browserHistory.push({
            pathname: '/chat',
            state: {
              username: responseJson.local.username,
            },
          });
        })
        .catch(() => {
          this.setState({ signInError: true });
        })

  handleErrorSnackbarRequestClose = () => {
    this.setState({
      showNotificationSnackbar: false,
      notificationSnackbarText: '',
    });
  };

  render() {
    const { username, password } = this.state;
    return (
      <div>
        <Snackbar
          open={this.state.showNotificationSnackbar}
          message={this.state.notificationSnackbarText}
          autoHideDuration={4000}
          onRequestClose={this.handleNotificationSnackbarRequestClose}
        />
        <div className="ChooseNickDialogContainer">
          <p>Chat App</p>

          <div className="ChooseNickDialog">
            <form onSubmit={this.onSubmit}>
              <TextField
                fullWidth
                autoFocus
                hintText="Username"
                value={username}
                onChange={e => this.setState({ username: e.target.value })}
              />
              <TextField
                type="password"
                fullWidth
                hintText="Password"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
                errorText={this.state.signInError && "Username and/or password doesn't match"}
              />
              <RaisedButton
                type="submit"
                disabled={false}
                fullWidth
                label="Login"
                primary
              />
            </form>
            <p>or <Link to="/register">create an account</Link></p>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  location: {
    state: {
      message: React.PropTypes.string,
    },
  },
};

Login.defaultProps = {
  location: {
    state: {
      message: '',
    },
  },
};

export default Login;
