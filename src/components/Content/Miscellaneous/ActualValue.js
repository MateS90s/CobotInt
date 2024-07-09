import React from 'react';
import './ActualValue.css';

function ActualValue ({ value }) {
    const formattedValue = value.toFixed(2); 
   

return (
    <div className="value-animation">
        <output>
            {formattedValue}
        </output>
    </div>
);

}


export default ActualValue