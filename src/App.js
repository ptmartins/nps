import { useState, useEffect } from 'react';
import Nps from './components/nps/Nps';

function App() {
  let [showNps, setShowNps] = useState(false);

  let closeModalHandler = () => setShowNps(false)

  return (
    <div className="app">
        <button className="btn" onClick={ () => { setShowNps(true) }}>Give NPS score</button>
        {/* Net Promoter Score component */}
        <Nps show={ showNps } closeModal={ closeModalHandler }></Nps>
    </div>
  );
}

export default App;