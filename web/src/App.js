/* eslint-disable no-undef */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
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
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          props.selectChatRoom(room.id);
        }}
      >
        <span>
          {room.name} ({room.nbMessages} messages)
        </span>
      </a>
    ))}
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      messages: [],
      token: "",
      currentRoom: null,
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

  selectChatRoom(id) {
    this.setState({ currentRoom: id });
    this.getMessages(id);
  }

  getMessages(roomId) {
    const db = firebase.firestore();
    db.collection("rooms")
      .doc(roomId)
      .onSnapshot(doc => {
        const messages = [];
        doc.data().messages.forEach(message => {
          messages.push(message);
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
          <a
            href="#"
            onClick={e => {
              this.setState({ currentRoom: null, messages: [] });
              e.preventDefault();
            }}
          >
            <img src={logo} className="App-logo" alt="logo" />
          </a>
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
            this.state.currentRoom ? (
              <Chat messages={this.state.messages} token={this.state.token} />
            ) : (
              <Rooms
                rooms={this.state.rooms}
                selectChatRoom={this.selectChatRoom.bind(this)}
              />
            )
          ) : (
            <SignIn />
          )}
        </div>
      </div>
    );
  }
}

export default App;
