/* eslint-disable no-undef */
import React, { useState } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import "./Chat.css";

const Chat = props => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState("");

  const getMessages = roomId => {
    console.log(props);
    const db = firebase.firestore();
    db.collection("rooms")
      .doc(roomId)
      .onSnapshot(doc => {
        const messages = [];
        doc.data().messages.forEach(message => {
          messages.push(message);
        });
        setMessages(messages);
      });
  };

  const sendMessage = () => {
    if (message.length === 0) alert("Empty message !");
    else {
      setIsSending(true);
      // use API!
      Axios.post(
        "https://europe-west1-ynovb3web.cloudfunctions.net/postMessage",
        {
          text: message,
          roomId: currentRoomId
        },
        {
          headers: {
            FirebaseToken: props.token
          }
        }
      )
        .then(response => {
          console.log(response);
          setMessage("");
          setIsSending(false);
        })
        .catch(error => {
          console.error(error);
          setIsSending(false);
        });
    }
  };

  const { roomId } = useParams();

  if (roomId !== currentRoomId) {
    getMessages(roomId);
    setCurrentRoomId(roomId);
  }

  return (
    <div className="Chat-body">
      <div className="Chat-messages">
        {messages.map(msg => (
          <span>{msg.text}</span>
        ))}
      </div>
      {
        // le <form> suivant permet de déclencher l'action du bouton lorsque l'on tape sur la touche "Entrée" depuis l'input
      }
      <form
        onSubmit={e => {
          if (!isSending) sendMessage();
          e.preventDefault();
        }}
      >
        <div className="Chat-composer">
          <input
            type="text"
            value={message}
            onChange={evt => setMessage(evt.target.value)}
            disabled={isSending}
          />
          <span style={{ width: "16px" }} />
          <a
            href="#"
            onClick={e => {
              if (!isSending) sendMessage();
              e.preventDefault();
            }}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              color={isSending ? "#AAA" : "#222"}
            />
          </a>
        </div>
      </form>
    </div>
  );
};

export default Chat;
