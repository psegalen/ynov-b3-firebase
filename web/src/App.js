/* eslint-disable no-undef */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";
import Chat from "./Chat/Chat";

const Loading = props => (
  <div
    style={{
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <img src={logo} className="App-logo" alt="logo" />
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      messages: [],
      token: ""
    };
  }

  componentDidMount() {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().onAuthStateChanged(user => {
          console.log("Auth changed: ", user);
          if (firebase.auth().currentUser) {
            firebase
              .auth()
              .currentUser.getIdToken()
              .then(token => {
                console.log("User token : ", token);
                if (this.state.token !== token) {
                  this.setState({
                    token
                  });
                }
              });
          }
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
    this.getMessages();
  }

  getMessages() {
    const db = firebase.firestore();
    db.collection("messages")
      .orderBy("time", "desc")
      .limit(10)
      .onSnapshot(querySnapshot => {
        const messages = [];
        querySnapshot.forEach(doc => {
          messages.push(doc.data());
        });
        this.setState({ messages });
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <span>
            Welcome{" "}
            {this.state.user &&
              (this.state.user.displayName || this.state.user.email)}
            !
          </span>
          <a
            href="#"
            onClick={e => {
              this.signOut();
              e.preventDefault();
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </a>
        </header>
        <div class="App-body">
          {this.state.isLoading ? (
            <Loading />
          ) : this.state.user ? (
            <Chat messages={this.state.messages} token={this.state.token} />
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    );
  }
}

export default App;
