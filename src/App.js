import { useState, useEffect } from 'react';
// import logo from './logo.svg';
import Nps from './components/nps/Nps';

function App() {
  return (
    <div className="app">
        {/* Net Promoter Score component */}
        <Nps></Nps>
    </div>
  );
}

export default App;