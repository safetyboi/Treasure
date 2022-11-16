import { useState } from "react";


const ClueForm = ({checkResponse, currentPin}) => {

  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    setResponse(e.target.value);
    checkResponse(response, currentPin);
  }

  return (
    <div className="clue-form-box">
      <h2>{`Current Clue: ${3}`}</h2>
      <form className="clue-form">
        <h4>Directions To This Pin</h4>
        <p>{currentPin.directionsToPin}</p>
        <label>My Response
          <input type='text' value={response} onChange={handleChange}/>
        </label>
      </form>
    </div>
  )
};

export default ClueForm;