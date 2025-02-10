import React from 'react';
import PriceDataGrid from './components/PriceDataGrid';
// import HeaderBar from './components/HeaderBar';

function App() {
  return (
    <div>
      <div style={{ padding: '1rem' }}>
        {/* <h2>PoE Currency Data</h2> */}
        <PriceDataGrid />
      </div>
    </div>
  );
}

export default App;
