import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEventErrors, createEvent } from '../../store/tweets';
import EventBox from './EventBox';
import PinBox from './PinBox'


function EventCreate () {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [distance, setDistance] = useState('');
    const [price, setPrice] = useState('');
    const [supplies, setSupplies] = useState('');
    const dispatch = useDispatch();
    const newEvent = useSelector(state => state.events.new);
    const errors = useSelector(state => state.errors.events);
    const [pins, setPins] = useState([]);
  
    useEffect(() => {
      return () => dispatch(clearEventErrors());
    }, [dispatch]);
  
    const handleSubmit = e => {
      e.preventDefault();
      dispatch(createEvent({ text })); 
    //   setText('');
    };
  
    const updateName = e => setName(e.currentTarget.value);
    const updateDescription = e => setDescription(e.currentTarget.value);
    const updateDuration = e => setDuration(e.currentTarget.value);
    const updateDistance = e => setDistance(e.currentTarget.value);
    const updatePrice = e => setPrice(e.currentTarget.value);
    const updateSupplies = e => setSupplies(e.currentTarget.value);

    const displayPins = ()=> {
        if (pins.length) {
        return (
          <ul>
            {pins.forEach(pin=>{
              <li>
                <PinBox pin={pin}/>
              </li>
            })}
            </ul>
        )
        } 
    }


    return (
      <>
        <form className="createEvent" onSubmit={handleSubmit}>
        <input 
            type="text"
            value={name}
            onChange={updateName}
            placeholder="What's in a name?"
          />
          <input 
            type="textarea"
            value={description}
            onChange={updateDescription}
            placeholder="Include a description..."
          />
          <input 
            type="number" //can you do 'number'?
            value={duration}
            onChange={updateDuration}
            placeholder="Apx how long should attendees expect this event to run?"
          />
          <input 
            type="text"
            value={distance}
            onChange={updateDistance}
            placeholder="Let them know how much ground they'll be covering"
          />
          <input 
            type="number" //are numbers allowed?
            value={price}
            onChange={updatePrice}
            placeholder="Including a cost estimate helps other users decide whether this is a realistic event for them to host"
          />
          <input 
            type="textarea"
            value={supplies}
            onChange={updateSupplies}
            placeholder="(Same with supplies)"
          />

          <div className="errors">{errors && errors.text}</div>
          <input type="submit" value="Submit" />
        </form>
        {/* <EventBox text={newEvent?.text} /> */}
        

      </>
    )
  }
  
  export default EventCreate;