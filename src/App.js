import { useState, useEffect } from 'react';
import Nps from './components/nps/Nps';

function App() {
  let [showNps, setShowNps] = useState(false);
  let [npsScore, setNpsScore] = useState(0);
  let [data, setData] = useState(null);

  useEffect(() => {
    calcNpsScore();
  }, [data]);

  useEffect(() => {
    updateNPS();
    calcNpsScore();
  }, []);

  let closeModalHandler = () => {
    setShowNps(false);
  }

  let calcNpsScore = () => {
    let promoters = null;
    let detractors = null;
    let result = null;

    if(data !== null) {
      data.forEach(data => {
        if(data.score >= 9 ) {
          promoters++;
        } else if(data.score <= 6) {
          detractors++;
        }
      })

      result = ((promoters / data.length) * 100) - ((detractors / data.length) * 100);
      setNpsScore(result.toFixed(1));
    } else { 
      console.log(data);
      setNpsScore(0);
    }
  }

  let updateNPS = () => {

    fetch('http://localhost:8000/scores')
            .then((res) => res.json())
            .then(data => { 
              setData(data);
            })
            .catch(err => console.log('Request failed', err))
  };

  return (
    <div className="app">
        <button className="btn" onClick={ () => { setShowNps(true) }}>Give NPS score</button>
        <div className="dashboard">
          <h2>Net Promoter Score</h2>
          <h1> { `${npsScore} %` } </h1>
        </div>
        {/* Net Promoter Score component */}
        <Nps show={ showNps } closeModal={ closeModalHandler } update={ updateNPS }></Nps>
    </div>
  );
}

export default App;