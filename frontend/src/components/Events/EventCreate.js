import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearEventErrors, createEvent } from '../../store/events';
import EventBox from './EventBox';
import { PinBox } from './PinBox'
import * as pinReducerActions from '../../store/pins'
import * as eventReducerActions from '../../store/events';
import { Redirect } from 'react-router-dom';



function EventCreate ({pins, mapData}) {
    let newEvent;
    const New = useSelector(state => state.new);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(0);
    const [distance, setDistance] = useState(0);
    const [price, setPrice] = useState(0);
    const [supplies, setSupplies] = useState('');
    const [elevation, setElevation] = useState(0);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    //add missing columns
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors.events);
  
    

  

  
    useEffect(() => {
      return () => dispatch(clearEventErrors());
    }, [dispatch]);

    
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      pins.forEach(pin=> {
        if (!pin.directionToPin.text) {
          console.log(`directions to ${pin.order} are required!`)
          return 
          //render error 'directions to `${pin.order} are required!
        }
      })

      newEvent = {
        name: name,
        description: description,
        duration: duration,
        distance: distance,
        price: price, 
        supplies: supplies,
        elevation: elevation,
        date: date,
        status: false
      }
      let eventExists = await dispatch(eventReducerActions.createEvent(newEvent));
      if (eventExists) {
        console.log(eventExists)
        // before we dispatch the createPin thunk, we need to add the event's id to the pin:
        // we theoretically have this information in the state, or will, if the event is successfully created
        const mappedPins = pins.map(pin=> { //is pins an array or an object holding an array? I don't know if '.map' is smart enough by itself to handle an object
          return {...pin, event: New.id}
        })
        
        mappedPins.forEach(pin=> {
          dispatch(pinReducerActions.createPin(pin))
          })
      }
        //Redirect to "/" or eventually the eventShow for newlycreated Event:
        // <Redirect to="/"/>
        console.log('completed handlesubmit')
    };
  
    const updateName = e => setName(e.currentTarget.value);
    const updateDescription = e => setDescription(e.currentTarget.value);
    const updateDuration = e => setDuration(e.currentTarget.value);
    const updateDistance = e => setDistance(e.currentTarget.value);
    const updatePrice = e => setPrice(e.currentTarget.value);
    const updateSupplies = e => setSupplies(e.currentTarget.value);
    const updateElevation = e => setElevation(e.currentTarget.value);
    const updateDate = e => setDate(e.currentTarget.value);
    const updateTime = e => setTime(e.currentTarget.value);
    const updateLocation = e => setLocation(e.currentTarget.value);

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

    const totalPrice = () => {
        let total = 0;
        pins.forEach(pin=> {
          total += pin.price;
        })
        return total;
    }

    const totalSupplies = () => {
      let total = ""
      pins.forEach(pin=> {
        total += pin.supplies;
      })
    }


    return (
      <>
        <form className="createEvent" onSubmit={handleSubmit}>
          <label>Event Name
            <input 
                type="text"
                value={name}
                onChange={updateName}
                placeholder="What's in a name?"
              />
          </label>
          <label> Description
          <input 
            type="textarea"
            value={description}
            onChange={updateDescription}
            placeholder="Include a description..."
          />
          </label>
          <label>Estimated Walking Duration
            <input 
            disabled
              type="number" //can you do 'number'?
              value={mapData.duration} //this will get passed down as a key on 'pins' prop
              onChange={updateDuration}
              placeholder="Apx how long should attendees expect this event to run?"
            />
            </label>          
          <label>Total Distance
            <input 
            disabled
              type="text"
              value={mapData.distance} //this will get passed down as a key on 'pins' prop
              onChange={updateDistance}
              placeholder="Let them know how much ground they'll be covering"
            />
            </label>
          <label>Estimated Supplies Cost
            <input 
            disabled
              type="number" //are numbers allowed?
              value={totalPrice()} //helper function
              onChange={updatePrice}
              placeholder="Including a cost estimate helps other users decide whether this is a realistic event for them to host"
            />            
            </label>
          <label> Supplies Needed
            <input 
            disabled
              type="textarea"
              value={totalSupplies} //helper function
              onChange={updateSupplies}
              placeholder="(Same with supplies)"
            />
          </label>
          <label> Total Elevation Gain
            <input 
              disabled
              type="number"
              value={mapData.elevation} //helper function
              onChange={updateElevation}
              placeholder="(Same with supplies)"
            />
          </label>
          <label>Date
            <input 
            type="date" //what type?
            value={date}
            onChange={updateDate}
            />
          </label>
          <label>Time
            <input
            type="time" //what type?
            value={time}
            onChange={updateTime}
            />
          </label>
          <label>Location
            <input
            type="text"
            value={location}
            onChange={updateLocation}
            />
          </label>


          <div className="errors">{errors && errors.text}</div>
          <input type="submit" value="Submit" />
        </form>
        <div>{displayPins}</div>

      </>
    )
  }
  
  export default EventCreate;