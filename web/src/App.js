/* eslint-disable no-undef */
import React from "react";
import Axios from "axios";
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
      isLoading: true,
      currentMessage: "",
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

  sendMessage() {
    if (this.state.currentMessage.length === 0) alert("Empty message !");
    else {
      // use API!
      Axios.post(
        "https://europe-west1-ynovb3web.cloudfunctions.net/postMessage",
        {
          text: this.state.currentMessage
        },
        {
          headers: {
            FirebaseToken: this.state.token
          }
        }
      )
        .then(response => console.log(response))
        .catch(error => console.error(error));
    }
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
            {this.state.messages.map(msg => (
              <span>{msg.text}</span>
            ))}
            <div style={{ marginBottom: "16px", flexDirection: "row" }}>
              <input
                type="text"
                value={this.state.currentMessage}
                onChange={evt =>
                  this.setState({ currentMessage: evt.target.value })
                }
              />
              <button onClick={this.sendMessage.bind(this)}>Send</button>
            </div>
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
