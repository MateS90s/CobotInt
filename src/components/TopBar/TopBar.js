import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css'

function TopBar({ connectionStatus, connectButton, disconnecttButton }) {
  const [address, setAddress] = useState('ws://localhost:9091');

  const handleConnect = () => {
    connectButton(address);
  };

  return (
    <div className="top-bar">
      <nav>
        <ul className="menu-list">
          <li><Link to="/">Strona główna</Link></li>
          <li><Link to="/logging">Logowanie</Link></li>
          <li><Link to="/pilot">Pilot</Link></li>
          <li><Link to="/program-builder">Program builder</Link></li>
          <li className="connection-madule">
            <button onClick={handleConnect}>Połącz</button>
            <input 
              type="text" 
              className="address-input" 
              placeholder="Adres" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={disconnecttButton}>Rozłącz</button>
            <div className={`connection-indicator ${connectionStatus !== 'connected' && 'disconnected'}`}>
              <span>({connectionStatus})</span>
            </div>
          </li>
          <li className="logo"><h1>COBOT<sub>int</sub></h1></li>
        </ul>
      </nav>
    </div>
  );
}

export default TopBar;