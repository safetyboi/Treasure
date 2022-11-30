import { useState } from "react";
import wrong from '../../assets/sounds/wrong.mp3';
import jingle from '../../assets/sounds/success-bell.wav';
import mallet from '../../assets/sounds/mallet.mp3';
import './GameMap.scss';


const ClueForm = ({intervalId, setCoords, addLocationPin, winSound, showClue, setShowEndGame, nextPin, grabPin, checkResponse, currentPinOrder, eventPins}) => {
  
  const jingleSound = new Audio(jingle);
  const [response, setResponse] = useState('');
  const currentPin = grabPin(currentPinOrder);
  const wrongSound = new Audio(wrong);
  const malletSound = new Audio(mallet);

  const checkAnswer = (e) => {
    e.preventDefault();
    if (currentPinOrder === eventPins.length && response === currentPin.task[0].correctAnswer) {
      winSound.play();
      clearInterval(intervalId);
      setShowEndGame(true);
    }

    else if (response === currentPin.task[0].correctAnswer) {
      jingleSound.play();
      setResponse('')
      setTimeout(() => {
        alert('Correct Response! You can now head for the next event pin.')
        nextPin();
      }, 500)
    } else {
      wrongSound.play();
      alert('Incorrect! Try again.')
    }
  }

  const handleCheat = (e) => {
    e.preventDefault();
    malletSound.play();
    if (showClue) {
      setResponse(currentPin.task[0].correctAnswer);
    } else {
      setCoords(allCoords => [...allCoords, {lat: currentPin.location[0].lat, lng: currentPin.location[0].lng}])
      setTimeout(() => {
        addLocationPin({lat: currentPin.location[0].lat, lng: currentPin.location[0].lng});
      },  500)
    }
  }

  if (eventPins.length < 1) return null;

  return (
    <div className="clue-form-box">
      <h2>{`Current Pin: ${currentPinOrder}`}</h2>
      <form onSubmit={checkAnswer} className="clue-form">
        <h4 className='task-header' >Directions To This Pin</h4>
        <p>{currentPin?.directionToPin[0].text}</p>
        <h4 className='task-header' >My Status</h4>
        <p>{showClue ? `You've arrived at Pin ${currentPinOrder}!` : `You haven't reached Pin ${currentPinOrder} yet!`}</p>
        { showClue &&
        <>
          <h4 className='task-header' >Clue</h4>
          <p>{currentPin?.task[0].prompt}</p>
          <label className='task-header' >My Response
            <input type='text' value={response} onChange={e => setResponse(e.target.value)}/>
          </label>
          <button className="submit_response">Submit Response</button>
        </>
        }
        <button
          onClick={handleCheat}>
          Cheat Button
          </button>
      </form>
    </div>
  )
};

export default ClueForm;