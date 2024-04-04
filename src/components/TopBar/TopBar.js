import React from 'react';
import StartPage from '../Content/StartPage/StartPage'
import Logging from '../Content/Logging/Logging'
import Pilot from '../Content/Pilot/Pilot'
import ProgramBuilder from '../Content/ProgramBuilder/ProgramBuilder'

import './TopBar.css'

class TopBar extends React.Component {
  state = {
    selectedComponent: null
  }


  // Funkcja do obsługi kliknięcia przycisku
  handleButtonClick = (componentName) => {
    this.setState({ selectedComponent: componentName });
  };


//Renderowanie
  render() {
    const { selectedComponent } = this.state;
    
    return (
      <div className="top-bar">
        {/* Tutaj dodaj zawartość paska nawigacyjnego, np. logo, menu, przyciski, itp. */}
        
        <nav>
          <ul className={'menu-list'}>
            <li><a onClick={() => this.handleButtonClick("StartPage")}>Strona główna</a></li>
            <li><a onClick={() => this.handleButtonClick("Logging")}>Logowanie</a></li>
            <li><a onClick={() => this.handleButtonClick("Pilot")}>Pilot</a></li>
            <li><a onClick={() => this.handleButtonClick("ProgramBuilder")}>Program builder</a></li>
            <li className='logo'><h1>COBOT<sub>int</sub></h1></li>
           </ul>
        </nav>
      
        {/* Warunkowe renderowanie kontentu interfejsu */}
        {selectedComponent === "StartPage" && <StartPage />}
        {selectedComponent === "Logging" && <Logging />}
        {selectedComponent === "Pilot" && <Pilot />}
        {selectedComponent === "ProgramBuilder" && <ProgramBuilder />}
      </div>
    );
  }
}

export default TopBar
