import React from 'react';
import './SliderInput.css';


function SliderInput({ value, onChange, jointNr, jointName }) {
  const handleSliderChange = (event) => {
    const newValue = parseFloat(event.target.value);
    onChange(newValue); //onChange jest funkcją propse, której wywołanie powoduje aktualizacje wartości NADRZĘDNEGO komponentu
  };

  return (
    <div className="slider">
      <p className="outputValue"><strong>{jointName}</strong></p>
      <output id={`slider-value-${jointNr}`} className="outputValue">
        <strong>{value.toFixed(2)}</strong>
      </output>
      <div>
        <input
          id={`slider-${jointNr}`}
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step={0.01}
          value={value}
          onChange={handleSliderChange}
          style={{ marginRight: '10px' }}
        />
      </div>
    </div>
  );
}

export default SliderInput;