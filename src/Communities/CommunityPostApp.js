// App.js
import React from 'react';
import Nav from "../Nav";
import WritePost from "./WritePost";

function postApp() {

  return (
      <div style={{ height: '100vh', width:'100vw', display: 'flex', flexDirection: 'column' }} className="App">
        <Nav />
        <WritePost />
      </div>
  );
}

export default postApp;
