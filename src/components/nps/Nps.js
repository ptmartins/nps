import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './Nps.css';

function Nps({show, closeModal, update, lastNPS}) {

    let brand = 'Imagen Go',
        [appState, setAppState] = useState({
            activeScore: null,
            scores: [0, 1, 2, 3, 4, 5, 6, 7 , 8, 9, 10]
        }),
        [data, setData] = useState({
            id: null,
            date: null,
            timestamp: null,
            day: null, 
            month: null,
            year: null,
            score: null
        }),
        [showThankYou, setShowthankYou] = useState(false),
        lastID = null;

    lastID = fetch('http://localhost:8000/scores')
                .then(response => response.json())
                .then(res => {
                    res.forEach((item, index) => {
                        if(index === res.length - 1) {
                        lastID = (res[index].id);
                        } else if(res.legth === 0) {
                            lastID = 0;
                        }
                    })
                });   

    useEffect(() => {
        let months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
            now = new Date(),
            _lastNPS = lastNPS,
            _date = now.toGMTString(),
            _timestamp = now.getTime(),
            _day = now.getDate(),
            _month = months[now.getMonth()],
            _year = now.getFullYear(),
            _newID = ++lastID;
        setData({...data, id: _newID, lastNPS: _lastNPS ,date: _date, timestamp: _timestamp, day: _day, month: _month, year: _year, score: appState.activeScore}); 
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
                    setData({...data, id: null, date: null, score: null});
                    setShowthankYou(true);
                    setTimeout(() => {
                        closeModal();
                        setShowthankYou(false);
                    }, 2000);
                })
                .catch(err => console.log('Request failed', err))
        }

        update();
    };

    return (
        <div className="nps" style={{ display: show ? 'block' : 'none'}}>
            <button className={ 'nps-close ' + (showThankYou ? 'hidden' : '') } onClick={ closeModal }> &times; </button>
            <div className="logo"> 
                <img src={ logo } alt="Imagen logo" title="Imagen"/>
            </div>
            <div className={ 'nps-scoreDetails ' + (showThankYou ? 'hidden' : '')}>
                <p className="nps-text">On a scale from 0-10, how likely are you to recommend <span> { brand } </span> to a friend or colleague?</p>
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
            <div className="nps-actions">
                <button type="submit" className={toggleSubmitStyles()} onClick={ handleSubmitScore }>Submit</button>
            </div> 
            </div> 
            <div className={'thankYou ' + (showThankYou ? 'active' : '')}>
                <h2 className="thankYou-title">Thank you for your feedback!</h2>
            </div>
        </div>
       
    )
}

export default Nps;