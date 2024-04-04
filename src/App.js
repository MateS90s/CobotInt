import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar/TopBar';
import LeftBar from './components/LeftBar/LeftBar';
import StartPage from './components/Content/StartPage/StartPage';
import Logging from './components/Content/Logging/Logging'
import Pilot from './components/Content/Pilot/Pilot'
import ProgramBuilder from './components/Content/ProgramBuilder/ProgramBuilder'




function App() {
  return (
    <Router>
      <div className="app-container">
        <TopBar />
        <LeftBar />

      </div>
    </Router>
  );
}

export default App;
