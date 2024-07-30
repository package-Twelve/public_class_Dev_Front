// App.js
import React from 'react';
import './Community.css';
import CommunityFeed from './CommunityFeed';
import Nav from "../Nav";

function App() {

  return (
      <div style={{ height: '100vh', width:'100vw', display: 'flex', flexDirection: 'column' }} className="App">
        <Nav />
        <CommunityFeed />
      </div>
  );
}

export default App;
