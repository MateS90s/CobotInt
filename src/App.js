import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar/TopBar';
import LeftBar from './components/LeftBar/LeftBar';
import StartPage from './components/Content/StartPage/StartPage';
import Logging from './components/Content/Logging/Logging'
import Pilot from './components/Content/Pilot/Pilot'
import ProgramBuilder from './components/Content/ProgramBuilder/ProgramBuilder'
import ROSLIB from 'roslib';

function App() {
  const [ros, setRos] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const connectionToRosbridge = (address) => {
    const newRos = new ROSLIB.Ros({ url: address });

    newRos.on("connection", () => {
      setConnectionStatus("connected");
    });

    newRos.on("error", (error) => {
      setConnectionStatus(`errored out (${error})`);
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
    <Router>
      <div className="app-container">
        <TopBar
          connectionStatus={connectionStatus}
          connectButton={connectionToRosbridge}
          disconnecttButton={disconnectFromRosbridge}
        />
        <LeftBar />
        <div>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/logging" element={<Logging />} />
            <Route path="/pilot" element={<Pilot
              ros={ros}
              connectionStatus={connectionStatus}
            />} />
            <Route path="/program-builder" element={<ProgramBuilder />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;