import { useState, useEffect } from 'react';
import Nps from './components/nps/Nps';

import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { faMeh } from "@fortawesome/free-solid-svg-icons";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {

  let [showNps, setShowNps] = useState(false),
      [npsScore, setNpsScore] = useState(0),
      [data, setData] = useState(null),
      [totalSubmissions, setTotalSubmissions] = useState(0),
      [detractors, setDetractors] = useState(0),
      [passives, setPassives] = useState(0),
      [promoters, setPromoters] = useState(0);

  useEffect(() => {
    calcNpsScore();
  }, [data]);

  useEffect(() => {
    fetchNpsData();
    calcNpsScore();
  }, []);


  /**
   * Close Modal Handler
   */
  let closeModalHandler = () => {
    setShowNps(false);
  }


  /**
   * Perform NPS calculations
   */
  let calcNpsScore = () => {

    console.log('calc nps');

    let promoters = 0,
        detractors = 0,
        passives = 0,
        totalCasts = 0,
        result = 0;

    if(data !== null) {
      if(data.length > 0) {
        data.forEach(data => {
          if(data.score >= 9 ) {
            promoters++;
          } else if(data.score <= 6) {
            detractors++;
          } else {
            passives++;
          }
          totalCasts++;
        })

        result = ((promoters / data.length) * 100) - ((detractors / data.length) * 100);
        setDetractors(detractors);
        setPassives(passives);
        setPromoters(promoters);
        setTotalSubmissions(totalCasts);
        setNpsScore(result.toFixed(1));
      }  else {
        setNpsScore(0);
      }
    } 
  }


  /**
   * Fetch NPS Data
   */
  let fetchNpsData = () => {

    fetch('http://localhost:8000/scores')
            .then((res) => res.json())
            .then(data => { 
              if(data !== []) {
                setData(data);
              } else {
                setNpsScore(0);
              }
              
            })
            .catch(err => console.log('Request failed', err))
  };

  return (
    <div className="app">
        <button className="btn" onClick={ () => { setShowNps(true) }}>Give NPS score</button>
        <div className="dashboard">
          <div className="card card--nps">
            <h2>Net Promoter Score</h2>
            <h1> { `${npsScore} %` } </h1>
          </div>
          <div className="card card--totals">
            <h4>Total responses:</h4>
            <h3> { totalSubmissions } </h3>
          </div>
          <div className="card card--totals24">
            <h4>Responses in last 24h:</h4>
            <h3> -- </h3>
          </div>
          <div className="card card--detractors">
            <FontAwesomeIcon icon={faFrown} />
            <h3>{ detractors }</h3>
          </div>
          <div className="card card--passives">
            <FontAwesomeIcon icon={faMeh} />
            <h3>{ passives }</h3>
          </div>
          <div className="card card--promoters">
            <FontAwesomeIcon icon={faSmile} />
            <h3>{ promoters }</h3>
          </div>
          
        </div>
        {/* Net Promoter Score component */}
        <Nps show={ showNps } closeModal={ closeModalHandler } update={ fetchNpsData }></Nps>
    </div>
  );
}

export default App;