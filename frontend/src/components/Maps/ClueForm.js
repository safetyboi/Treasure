import { useState } from "react";


const ClueForm = ({currentPinOrder, eventPins}) => {

  const [response, setResponse] = useState('');
  const currentPin = eventPins.filter(pin => pin.order === currentPinOrder)[0]


  return (
    <div className="clue-form-box">
      <h2>{`Current Clue: ${3}`}</h2>
      <form className="clue-form">
        <h4>Directions To This Pin</h4>
        <p>{currentPin.directionsToPin}</p>
        <label>My Response
          <input type='text' value={response} onChange={e => setResponse(e.target.value)}/>
        </label>
      </form>
    </div>
  )
};

export default ClueForm;