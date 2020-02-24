/* eslint-disable no-undef */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";
import Chat from "./Chat/Chat";
import Axios from "axios";

const Loading = () => (
  <div className="App-loading">
    <img src={logo} className="App-logo" alt="logo" />
  </div>
);

const Rooms = props => (
  <div className="App-rooms">
    <span>Sélectionnez une chat room :</span>
    {props.rooms.map(room => (
      <Link to={`/room/${room.id}`}>
        <span>
          {room.name} ({room.nbMessages} messages)
        </span>
      </Link>
    ))}
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      token: "",
      rooms: []
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
    this.getRooms();
  }

  getRooms() {
    Axios.get("https://europe-west1-ynovb3web.cloudfunctions.net/getRooms")
      .then(response => this.setState({ rooms: response.data.rooms }))
      .catch(error => console.error(error));
  }

  signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("User signed out"));
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo" />
            </Link>
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
              <Switch>
                <Route path="/room/:roomId">
                  <Chat
                    messages={this.state.messages}
                    token={this.state.token}
                  />
                </Route>
                <Route path="/">
                  <Rooms rooms={this.state.rooms} />
                </Route>
              </Switch>
            ) : (
              <SignIn />
            )}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
