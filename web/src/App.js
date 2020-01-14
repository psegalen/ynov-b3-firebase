/* eslint-disable no-undef */
import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = () => {
    console.log(email, password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log(result);
        alert("Your uid is: " + result.user.uid);
      })
      .catch(function(error) {
        console.error(error);
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={evt => setPassword(evt.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <button onClick={() => login()}>Sign In</button>
      </header>
    </div>
  );
}

export default App;
