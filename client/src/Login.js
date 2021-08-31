import React, { useState } from "react";

export default function Login({ userName, setUserName, setScene }) {
  const [error, setError] = useState(false);

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  const login = () => {
    if (userName !== "") {
      if (userName.length >= 3 && userName.length <= 10) setScene(1);
      else setError(true);
    }
  };

  return (
    <div id="login">
      {error ? (
        <div id="usernameError">
          Username characters count must be between 3-10
        </div>
      ) : null}
      <div id="loginContainer">
        <input
          value={userName}
          type="text"
          placeholder="Enter your nickname"
          onChange={(e) => handleUserName(e)}
        />
        <button id="loginBtn" onClick={() => login()}>
          Login
        </button>
      </div>
    </div>
  );
}
