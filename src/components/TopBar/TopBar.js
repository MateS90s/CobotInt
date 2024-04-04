import React from 'react';
import { Link } from 'react-router-dom'; // Importuj Link zamiast a
import StartPage from '../Content/StartPage/StartPage'
import Logging from '../Content/Logging/Logging'
import Pilot from '../Content/Pilot/Pilot'
import ProgramBuilder from '../Content/ProgramBuilder/ProgramBuilder'

import './TopBar.css'

class TopBar extends React.Component {
  state = {
    selectedComponent: null
  }





//Renderowanie
  render() {

    return (
      <div className="top-bar">
        {/* Tutaj dodaj zawartość paska nawigacyjnego, np. logo, menu, przyciski, itp. */}
        
        <nav>
          <ul className={'menu-list'}>
          <li><Link to="/">Strona główna</Link></li>
            <li><Link to="/logging">Logowanie</Link></li>
            <li><Link to="/pilot">Pilot</Link></li>
            <li><Link to="/program-builder">Program builder</Link></li>
            <li className='logo'><h1>COBOT<sub>int</sub></h1></li>
           </ul>
        </nav>
      
      </div>
    );
  }
}

export default TopBar
