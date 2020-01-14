/* eslint-disable no-undef */
import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";

const Loading = props => (
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
  </header>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true
    };
  }

  componentDidMount() {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().onAuthStateChanged(user => {
          console.log("Auth changed: ", user);
          if (user) {
            this.setState({ user, isLoading: false });
          } else {
            this.setState({ isLoading: false, user: null });
          }
        });
      })
      .catch(function(error) {
        console.error(error);
      });
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out"));
  }

  render() {
    return (
      <div className="App">
        {this.state.isLoading ? (
          <Loading />
        ) : this.state.user ? (
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <span style={{ marginBottom: "16px" }}>
              Welcome {this.state.user.displayName || this.state.user.email}!
            </span>
            <button onClick={this.signOut}>Sign Out</button>
          </header>
        ) : (
          <SignIn />
        )}
      </div>
    );
  }
}

export default App;
