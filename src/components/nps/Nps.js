import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './Nps.css';
function Nps() {

    let brand = 'Imagen Go',
        [appState, setAppState] = useState({
            activeScore: null,
            scores: [0, 1, 2, 3, 4, 5, 6, 7 , 8, 9, 10]
        }),
        [data, setData] = useState({
            id: null,
            date: null,
            score: null
        }),
      lastID = null;

    lastID = fetch('http://localhost:8000/scores')
                .then(response => response.json())
                .then(res => {
                res.forEach((item, index) => {
                    if(index === res.length - 1) {
                    lastID = (res[index].id);
                    }
                })
                });   

    useEffect(() => {
        let now = new Date(),
        _date = now.toGMTString(),
        _newID = ++lastID;
        setData({...data, id: _newID, date: _date, score: appState.activeScore}); 
    }, [appState]);

    /**
     * Toggle active element
     * 
     * @param {*} index 
     */          
    let toggleActive = (index) => {
        setAppState({...appState, activeScore: appState.scores[index]});
    };


    /**
     * Set score button styles
     * 
     * @param {*} index 
     * @returns 
     */
    let toggleScoreStyles = (index) => {
        if(appState.scores[index] === appState.activeScore) {
        return 'score active'
        } else {
        return 'score';
        }
    };


  /**
   * Toggle styles for submit button (if there's a value selected, set it active)
   */
  let toggleSubmitStyles = () => {
    if(appState.activeScore !== null) {
      return ('btn btn--submit active');
    } else {
      return ('btn btn--submit');
    }
  };


    /**
     * Handle submit 
     */
    let handleSubmitScore = () => {
        const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        };

        if(appState.activeScore !== null && data.id !== null) {
        fetch('http://localhost:8000/scores', fetchOptions)
            .then(() => {
                setAppState({...appState, activeScore: null});
                setData({...data, id: null, date: null, score: null})
            })
            .catch(err => console.log('Request failed', err))
        }

    };

    return (
        <div className="nps">
            <button className="app-close"> &times; </button>
            <div className="logo"> 
                <img src={ logo } alt="IMagen logo" title="Imagen"/>
            </div>
            <p className="app-text">On a scale from 0-10, how likely are you to recommend <span> { brand } </span> to a friend or colleague?</p>
            <div className="score-scale">
                <span className="help-txt help-txt--low">Now at all likely</span>
                {
                appState.scores.map((score, index) => 
                <div className={toggleScoreStyles(index)} key={ index } onClick={ () => { 
                toggleActive(index);
                }}> { score } </div>
                )
                }
                <span className="help-txt help-txt--high">Extremely likely</span>
            </div>
            <div className="app-actions">
                <button type="submit" className={toggleSubmitStyles()} onClick={ handleSubmitScore }>Submit</button>
            </div>  
        </div>
       
    )
}

export default Nps;