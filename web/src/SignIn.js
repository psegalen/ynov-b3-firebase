/* eslint-disable no-undef */
import React, { useState } from "react";
import logo from "./logo.svg";

const reportError = error => {
  console.error(error);
  alert(error.message);
};

function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const login = () => {
    console.log(email, password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => console.log("User signed in"))
      .catch(error => reportError(error));
  };
  const createUser = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log("User created");
        res.user
          .updateProfile({
            displayName: name
          })
          .then(() => console.log("Display name set"))
          .catch(error => reportError(error));
      })
      .catch(error => reportError(error));
  };
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {isSignUp ? (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={evt => setName(evt.target.value)}
          style={{ marginBottom: "16px" }}
        />
      ) : (
        undefined
      )}
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
      <button
        onClick={() => {
          isSignUp ? createUser() : login();
        }}
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>
      <a
        href="#"
        onClick={() => setIsSignUp(!isSignUp)}
        style={{ marginTop: "16px" }}
      >
        Switch to {isSignUp ? "Sign In" : "Sign Up"}
      </a>
    </header>
  );
}

export default SignIn;
