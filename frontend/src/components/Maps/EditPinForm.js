import { useEffect, useState } from 'react';
import './PinEditForm.scss';
import './Map.scss';

const PinEditForm = ({deletePin, marker, pin, addPinToArray}) => {
  const [directions, setDirections] = useState(pin?.directionToPin ? pin.directionToPin.text : '');
  const [challengePrompt, setChallengePrompt] = useState(pin?.challengePrompt ? pin.challengePrompt : '');
  const [challengeAnswser, setChallengeAnswser] = useState(pin?.challengeAnswser ? pin.challengeAnswser : '');
  const [supplies, setSupplies] = useState(pin?.supplies ? pin.supplies : '');
  const [activityDuration, setActivityDuration] = useState(pin?.activityDuration ? pin.activityDuration : 0);
  const [price, setPrice] = useState(pin?.price ? pin.price : '');  
  const [currentPin, setcurrentPin] = useState(pin);
  
  useEffect(() => {
    if (pin) {
      setDirections(pin.directionToPin?.text);
      setChallengePrompt(pin.task?.prompt);
      setChallengeAnswser(pin.task?.correctAnswer);
      setSupplies(pin?.supplies);
      setActivityDuration(pin?.duration);
      setPrice(pin?.price);
    } else {
      setDirections('');
      setChallengePrompt('');
      setChallengeAnswser('');
      setSupplies('');
      setActivityDuration(0);
      setPrice(0);
    }
  }, [pin?.order])

  useEffect(() => {
    setcurrentPin({
      order: pin.order,
      location: {
        lat: marker.position.lat(),
        lng: marker.position.lng(),
      },
      directionToPin: {text: directions},
      task: {
        prompt: challengePrompt,
        correctAnswer: challengeAnswser,
      },
      supplies: supplies,
      price: parseInt(price),
      duration: parseInt(activityDuration)
    })
  }, [directions, challengeAnswser, challengePrompt, supplies, activityDuration, price, ])

  useEffect(() => {
    addPinToArray(currentPin)
  }, [currentPin]);

  const handleDelete = (e) => {
    e.preventDefault();
    deletePin(marker);
  }

  return (
    <div className="pin-edit-area">
      <div className='flex-row justify-between'>
        <h2>Edit Pins</h2>
      </div>

      <form className="pin-edit-form">
        <label>Pin Order
          <input disabled placeholder="" value={pin.order}/>
        </label>
        <label>Directions to get to this pin
          <input placeholder="*Required*" onChange={e => {setDirections(e.target.value)}} value={directions}/>
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
        <button onClick={handleDelete} >Delete Pin</button>
      </form>
    </div>
  )

};

export default PinEditForm;