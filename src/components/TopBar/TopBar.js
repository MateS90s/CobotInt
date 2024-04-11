import React, {useState} from 'react';
import { Link } from 'react-router-dom'; // Importuj Link zamiast a
import ROSLIB from 'roslib';


import './TopBar.css'

function TopBar() {
  const [ros, setRos] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  


  const connectionToRosbridge = () => {
    const newRos = new ROSLIB.Ros({ url: "ws://localhost:9091" });
  

    newRos.on("connection", () => {
        setConnectionStatus("connected");
    });

    newRos.on("error", (error) => {
      setConnectionStatus(`errored out (${error})`);git stat
    });

    newRos.on("close", () => {
      setConnectionStatus("closed");
    });

    setRos(newRos);
  };

  const disconnectFromRosbridge = () => {
    if (ros) {
      ros.close();
      setRos(null);
      setConnectionStatus("disconnected");
    }
  };

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
              <button onClick={connectionToRosbridge}>Połącz</button>
              <button onClick={disconnectFromRosbridge}>Rozlącz</button>
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
