import React from 'react';
import PriceDataGrid from './components/PriceDataGrid';

function App() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '1rem' 
      }}
    >
      <PriceDataGrid />
    </div>
  );
}

export default App;
