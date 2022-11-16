import './PinEditForm.css';
import { useState } from 'react';

const PinEditForm = ({marker, handlePinSubmit, deletePin}) => {
  const [directions, setDirections] = useState('');
  const [challengePrompt, setChallengePrompt] = useState('');
  const [challengeAnswser, setChallengeAnswser] = useState('');
  const [supplies, setSupplies] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPin = {
      order: marker.order,
      location: {
        latitude: marker.position.lat(),
        longitude: marker.position.lng(),
      },
      directionToPin: {text: directions},
      task: {
        prompt: challengePrompt,
        correctAnswer: challengeAnswser,
      },
      supplies: supplies,
      price: parseInt(price),
      duration: parseInt(activityDuration)
    };

    handlePinSubmit(newPin);
  }

  return (
    <>
      <div className="pin-edit-form">
        <form className="pin-edit-form" onSubmit={handleSubmit}>
          <label>Pin Order
            <input disabled placeholder="" value={marker.order}/>
          </label>
          <label>Directions to get to this pin
            <input placeholder="" onChange={e => {setDirections(e.target.value)}} value={directions}/>
          </label>
          <label>Challenge Prompt
            <input placeholder="" onChange={e => {setChallengePrompt(e.target.value)}} value={challengePrompt}/>
          </label>
          <label>Correct Answer
            <input placeholder="" onChange={e => {setChallengeAnswser(e.target.value)}} value={challengeAnswser}/>
          </label>
          <label>Supplies Needed
            <input placeholder="" onChange={e => {setSupplies(e.target.value)}} value={supplies}/>
          </label>
          <label>Price
            <input placeholder="" onChange={e => {setPrice(e.target.value)}} value={price}/>
          </label>
          <label>Activity Duration
            <input placeholder="" onChange={e => {setActivityDuration(e.target.value)}} value={activityDuration}/>
          </label>
          <button>Set Pin</button>
          <button onClick={deletePin}>Delete Pin</button>
        </form>
      </div>
    </>
  )

};

export default PinEditForm;