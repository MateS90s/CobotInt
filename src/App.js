import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar/TopBar';
import LeftBar from './components/LeftBar/LeftBar';
import StartPage from './components/Content/StartPage/StartPage';
import Logging from './components/Content/Logging/Logging'
import Pilot from './components/Content/Pilot/Pilot'
import ProgramBuilder from './components/Content/ProgramBuilder/ProgramBuilder'




function App() {

  //Przekazanie statusu z TopBar do Pilota
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const handleConnectionStatusChange = (status) => {
    setConnectionStatus(status);
  }

  return (
    <Router>
      <div className="app-container">
        <TopBar onConnectionStatusChange={handleConnectionStatusChange} />
        <LeftBar />
        <div>
        <Routes>
            <Route path="/" element={<StartPage />} />  
            <Route path="/logging" element={<Logging />} />
            <Route path="/pilot" element={<Pilot connectionStatus={connectionStatus} />} />
            <Route path="/program-builder" element={<ProgramBuilder />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
