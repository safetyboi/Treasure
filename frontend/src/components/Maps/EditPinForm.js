import './PinEditForm.css';
import { useEffect, useState } from 'react';

const PinEditForm = ({pins, marker, handlePinSubmit, deletePin}) => {
  console.log(pins)
  const pin = pins.filter(pin => {
    return pin.order === marker.order
  })[0] 
  const [directions, setDirections] = useState(pin ? pin.directionToPin.text : '');
  const [challengePrompt, setChallengePrompt] = useState(pin ? pin.challengePrompt : '');
  const [challengeAnswser, setChallengeAnswser] = useState(pin ? pin.challengeAnswser : '');
  const [supplies, setSupplies] = useState(pin ? pin.supplies : '');
  const [activityDuration, setActivityDuration] = useState(pin? pin.activityDuration : 0);
  const [price, setPrice] = useState(pin ? pin.price : 0);

  useEffect(() => {
    if (pin) {
      setDirections(pin.directionToPin.text);
      setChallengePrompt(pin.task.prompt);
      setChallengeAnswser(pin.task.correctAnswer);
      setSupplies(pin.supplies);
      setActivityDuration(pin.duration);
      setPrice(pin.price);
    } else {
      setDirections('');
      setChallengePrompt('');
      setChallengeAnswser('');
      setSupplies('');
      setActivityDuration(0);
      setPrice(0);
    }
  }, [pin])

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
  };

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