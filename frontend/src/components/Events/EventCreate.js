import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; 
import { clearEventErrors, createEvent } from '../../store/events';
import EventBox from './EventBox';
import { PinBox } from './PinBox'
import * as pinReducerActions from '../../store/pins'
import * as eventReducerActions from '../../store/events';
import jwtFetch from '../../store/jwt';
import './Event.scss'


function EventCreate ({pins, mapData}) {
    let newEvent;
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
    const history = useHistory();
    let imageFile;
  
    useEffect(() => {
      return () => dispatch(clearEventErrors());
    }, [dispatch]);

    const updateImage = async (e) => {
      imageFile = e.target.files[0] 
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("images", imageFile);

      pins.forEach(pin=> {
        if (!pin.directionToPin.text) {
          console.log(`directions to ${pin.order} are required!`)
          return 
          //render error 'directions to `${pin.order} are required!
        }
      });

      const firstPin = pins.filter(pin => {
        return pin.order === 1
      })[0]

      newEvent = {
        name: name,
        description: description,
        duration: mapData.duration,
        distance: mapData.distance,
        price: totalPrice(), 
        supplies: totalSupplies(),
        elevation: mapData.elevation,
        date: date,
        status: false,
        initCoords: firstPin.location,
        location: location
      }
      let eventExists = await dispatch(eventReducerActions.createEvent(newEvent));
      
      if (eventExists) { 
        await jwtFetch(`/api/events/addImage/${eventExists._id}`, {
          method: "PATCH",
          body: formData,
        })
      }
      
      if (eventExists) {
        // before we dispatch the createPin thunk, we need to add the event's id to the pin:
        // we theoretically have this information in the state, or will, if the event is successfully created
        const mappedPins = pins.map(pin=> { //is pins an array or an object holding an array? I don't know if '.map' is smart enough by itself to handle an object
          return {...pin, event: eventExists._id}
        })
        mappedPins.forEach(pin=> {
          dispatch(pinReducerActions.createPin(pin))
          })
      }
        //Redirect to "/" or eventually the eventShow for newlycreated Event:
        // <Redirect to="/"/>
        history.push(`/events`)
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
        if (pins?.length) {
        return (
          <ul className='pin_box'>
            {pins.map(pin=>{
              return (
              <li>
                <PinBox pin={pin}/>
              </li>
              )
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
        if (pin.supplies.length > 0) return total += `${pin.supplies}, `;
      })
      return total;
    }

    const totalDuration = () => {
      let total = mapData.duration;
      pins.forEach(pin=> {
        return total += pin.duration;
      })
      return total;
    }

    return (
      <>
        <div className='form_area'>
          <form className="create_event" onSubmit={handleSubmit}>
            <h2>Event Details</h2> 
            <div className='border'></div>
            <label>Event Name
              <input 
                  type="text"
                  value={name}
                  onChange={updateName}
                  placeholder="What's in a name?"
                />
            </label>
            <div className='date_time_form flex-row justify-between'>
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
            </div>
            <label>Location
              <input
              type="text"
              value={location}
              onChange={updateLocation}
              />
            </label>
            <div className='textarea'>
              <label> Description</label>
              <textarea 
                value={description}
                onChange={updateDescription}
                className="textarea"
                placeholder="Include a description...">
              </textarea>
            </div>
            <div className='textarea'>
              <label> Supplies List</label>
              <textarea 
                disabled
                className="textarea"
                value={totalSupplies()}>
              </textarea> 
            </div>
            
            <label>Estimated Supplies Cost
              <input 
                disabled
                type="number" //are numbers allowed?
                value={totalPrice()} //helper function
              />            
            </label>

            <div className="errors">{errors && errors.text}</div>
            <input type="file" onChange={updateImage} multiple />
            <input type="submit" value="Submit" />
          </form>
          {/* <div>{displayPins()}</div> */}

          {/* <label>Estimated Event Duration
              <input 
              disabled
                type="number" //can you do 'number'?
                value={totalDuration()} //this will get passed down as a key on 'pins' prop
                placeholder="Apx how long should attendees expect this event to run?"
              />
              </label>      
            <label>Estimated Walking Duration
              <input 
              disabled
                type="number" //can you do 'number'?
                value={mapData.duration} //this will get passed down as a key on 'pins' prop
                placeholder="Apx how long should attendees expect this event to run?"
              />
              </label>          
            <label>Total Distance
              <input 
              disabled
                type="text"
                value={mapData.distance} //this will get passed down as a key on 'pins' prop
                placeholder="Let them know how much ground they'll be covering"
              />
              </label>
            <label> Total Elevation Gain
              <input 
                disabled
                type="number"
                value={mapData.elevation} //helper function            
              />
            </label> */}
        </div>

        <div className='map_stat_wrapper'>
          <div className='flex-row'>
            <p className='stat_key'>Estimated Event Duration</p>
            <p className='stat_value'>{totalDuration()}</p>
          </div>
          <div className='flex-row'>
            <p className='stat_key'>Estimated Walking Duration</p>
            <p className='stat_value'>{mapData.duration}</p>
          </div>
          <div className='flex-row'>
            <p className='stat_key'>Total Distance</p>
            <p className='stat_value'>{mapData.distance}</p>
          </div>
          <div className='flex-row'>
            <p className='stat_key'>Total Elevation Gain</p>
            <p className='stat_value'>{mapData.elevation}</p>
          </div>
        </div>
      </>
    )
  }
  
  export default EventCreate;