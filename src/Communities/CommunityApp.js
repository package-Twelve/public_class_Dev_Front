// App.js
import React from 'react';
import './Community.css';
import Navbar from './Navbar';
import CommunityFeed from './CommunityFeed';

function App() {

  return (
      <div style={{ height: '100vh', width:'100vw', display: 'flex', flexDirection: 'column' }} className="App">
        <Navbar />
        <CommunityFeed />
      </div>
  );
}

export default App;
