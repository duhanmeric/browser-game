import React from "react";

export default function Login({ userName, setUserName, setScene }) {
  const handleUserName = (e) => {
    setUserName(e.target.value);
    console.log(userName.length < 3 || userName.length > 7);
  };

  const login = () => {
    if (userName !== "") {
      if (userName.length >= 3 && userName.length <= 7) setScene(1);
    }
  };

  return (
    <div id="login">
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
  );
}
