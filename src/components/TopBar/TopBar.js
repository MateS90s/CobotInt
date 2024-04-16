import React from 'react';
import { Link } from 'react-router-dom'; // Importuj Link zamiast a



import './TopBar.css'

function TopBar( {connectionStatus, connectButton, disconnecttButton }) {


    return (
      <div className="top-bar">
        {/* Tutaj dodaj zawartość paska nawigacyjnego, np. logo, menu, przyciski, itp. */}
        
        <nav>
          <ul className={'menu-list'}>
          <li><Link to="/">Strona główna</Link></li>
            <li><Link to="/logging">Logowanie</Link></li>
            <li><Link to="/pilot">Pilot</Link></li>
            <li><Link to="/program-builder">Program builder</Link></li>
            <li>
              <button onClick={connectButton}>Połącz</button>
              <button onClick={disconnecttButton}>Rozlącz</button>
              <div className={`connection-indicator ${connectionStatus !== 'connected' && 'disconnected'}`}>
                <span>({connectionStatus})</span>
              </div>
            </li>
            <li className='logo'><h1>COBOT<sub>int</sub></h1></li>
           </ul>
        </nav>

        
        
       </div>
    );
}

export default TopBar
