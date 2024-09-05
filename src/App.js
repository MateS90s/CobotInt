import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ROSLIB from 'roslib';

// Moje komponenty
import TopBar from './components/TopBar/TopBar';
import LeftBar from './components/LeftBar/LeftBar';
import StartPage from './components/Content/Dashboard/Dashboard';
import Logging from './components/Content/Logging/Logging';
import Pilot from './components/Content/Pilot/Pilot';
import SmartControl from './components/Content/SmartControl/SmartControl';
import ProgramBuilder from './components/Content/ProgramBuilder/ProgramBuilder';
import StatusBar from './components/StatusBar/StatusBar';

function App() {
  const [ros, setRos] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          <LeftBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className="flex flex-col flex-1">
            <div className="flex-none">
              <TopBar connectionStatus={connectionStatus} />
            </div>
            <div className="flex flex-1 overflow-auto p-4">
              <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/logging" element={<Logging />} />
                <Route path="/pilot" element={<Pilot ros={ros} connectionStatus={connectionStatus} />} />
                <Route path="/smart-control" element={<SmartControl />} />
                <Route path="/program-builder" element={<ProgramBuilder />} />
              </Routes>
            </div>
          </div>
        </div>
        <div className="flex-none">
          <StatusBar
            connectionStatus={connectionStatus}
            connectToRos={connectionToRosbridge}
            disconnectFromRos={disconnectFromRosbridge}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;
