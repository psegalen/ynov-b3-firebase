import React from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Chat.css";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMessage: "",
      isSending: false
    };
  }

  sendMessage() {
    if (this.state.currentMessage.length === 0) alert("Empty message !");
    else {
      this.setState({ isSending: true });
      // use API!
      Axios.post(
        "https://europe-west1-ynovb3web.cloudfunctions.net/postMessage",
        {
          text: this.state.currentMessage
        },
        {
          headers: {
            FirebaseToken: this.props.token
          }
        }
      )
        .then(response => {
          console.log(response);
          this.setState({ currentMessage: "", isSending: false });
        })
        .catch(error => {
          console.error(error);
          this.setState({ isSending: false });
        });
    }
  }

  render() {
    return (
      <div className="Chat-body">
        <div className="Chat-messages">
          {this.props.messages.map(msg => (
            <span>{msg.text}</span>
          ))}
        </div>
        {
          // le <form> suivant permet de déclencher l'action du bouton lorsque l'on tape sur la touche "Entrée" depuis l'input
        }
        <form
          onSubmit={e => {
            if (!this.state.isSending) this.sendMessage();
            e.preventDefault();
          }}
        >
          <div className="Chat-composer">
            <input
              type="text"
              value={this.state.currentMessage}
              onChange={evt =>
                this.setState({ currentMessage: evt.target.value })
              }
              disabled={this.state.isSending}
            />
            <span style={{ width: "16px" }} />
            <a
              href="#"
              onClick={e => {
                if (!this.state.isSending) this.sendMessage();
                e.preventDefault();
              }}
            >
              <FontAwesomeIcon
                icon={faPaperPlane}
                color={this.state.isSending ? "#AAA" : "#222"}
              />
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default Chat;
