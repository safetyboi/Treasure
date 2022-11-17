import { useState } from "react";


const ClueForm = ({grabPin, checkResponse, currentPinOrder, eventPins}) => {

  const [response, setResponse] = useState('');
  const currentPin = grabPin(currentPinOrder)
  const checkAnswer = (e) => {
    checkResponse(response, currentPin);
  }

  if (eventPins.length < 1) return null;

  console.log(eventPins)

  return (
    <div className="clue-form-box">
      <h2>{`Current Clue: ${currentPinOrder}`}</h2>
      <form onSubmit={checkAnswer} className="clue-form">
        <h4>Directions To This Pin</h4>
        <p>{currentPin?.directionToPin[0].text}</p>
        <p>{currentPin?.task[0].prompt}</p>
        <label>My Response
          <input type='text' value={response} onChange={e => setResponse(e.target.value)}/>
        </label>
        <button>Submit Response</button>
      </form>
    </div>
  )
};

export default ClueForm;