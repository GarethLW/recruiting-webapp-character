// src/components/Attribute.js

import React from 'react';

const Attribute = ({ name, value, onIncrement, onDecrement }) => {
  // Calculate ability modifier
  const calculateModifier = (value) => Math.floor((value - 10) / 2);

  return (
    <div className="attribute-row">
      <h3>{name}</h3>
      <p>Value: {value}</p>
      <p>Modifier: {calculateModifier(value)}</p> {/* Display the calculated modifier */}
      <button onClick={onDecrement}>-</button>
      <button onClick={onIncrement}>+</button>
    </div>
  );
};

export default Attribute;
